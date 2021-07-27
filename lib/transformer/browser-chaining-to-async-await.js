'use strict';

const _ = require('lodash');
const BaseTransformer = require('./base');
const u = require('../utils');
const {BROWSER_NAME_OPTION, NOT_AWAIT_OPTION, BROWSER_CHAINING_MODE} = require('../constants');

module.exports = class BrowserChainingTransformer extends BaseTransformer {
    constructor(...args) {
        super(...args, BROWSER_CHAINING_MODE);
    }

    findBrowserChainingFns() {
        let browserChainingFns = [];

        this._eachBrowserExpr(({fn, browser, isRunnable}) => {
            const chainingCalls = this._findBrowserChainingCalls(browser);

            if (chainingCalls.size() === 0) {
                return;
            }

            const usedFn = _.find(browserChainingFns, {fn});

            if (usedFn) {
                usedFn.browserExps.push({browser, chainingCalls});
                return;
            }

            browserChainingFns.push({
                fn, isRunnable, browserExps: [{browser, chainingCalls}]
            });
        });

        return browserChainingFns;
    }

    fromBrowserChainingToAsyncAwait(fnData) {
        const {browserExps, isRunnable, fn} = fnData;
        const {node: fnNode} = fn;
        const hasChainedCalls = u.hasBrowserChainedCalls(browserExps);

        if (hasChainedCalls || isRunnable) {
            u.mkFnAsync(fnNode);
            u.removeDuplicateParenthesesForIIFE(fnNode);
        }

        browserExps.forEach((browserExp, i) => {
            const lastBrowserChaining = i === browserExps.length - 1;
            this._splitChainedBrowserCommands(browserExp, isRunnable, lastBrowserChaining);
        });

        this._removeUnnecessaryReturns(fnNode, isRunnable);
        this._removeAwaitFromPassedNodes(fnNode);
    }

    _findBrowserChainingCalls(browser) {
        return this._j(browser)
            .closestAll([this._j.CallExpression, this._j.MemberExpression], this._root)
            .filter(u.isChainingCall);
    }

    _splitChainedBrowserCommands(browserExp, isRunnable, lastBrowserChaining) {
        const {browser, chainingCalls} = browserExp;
        const chainingCallPaths = chainingCalls.paths();
        const lastChainedCall = _.last(chainingCallPaths);
        const hasChainedCalls = chainingCallPaths.length > 1;

        const browserStatement = this._j(lastChainedCall.parent);
        const browserStatementNode = browserStatement.get().node;
        const browserStatementParentNode = browserStatement.get().parent.node;

        if (u.isAwaitExpr(browserStatementNode) && !hasChainedCalls) {
            return;
        }

        if (u.isLogicalExpr(browserStatementNode) || u.isConditionalExpr(browserStatementNode)) {
            this._warnings.addWarnToSourceCode({problemNode: browserStatementNode, parentNode: browserStatement});

            return;
        }

        const browserComments = u.compactedConcat(browser.node.comments, browser.node.object.comments)
            .map(u.switchCommentPosition);

        u.cleanNodeComments([browser.node, browser.node.object]);

        let changeCollection;

        if (u.isAwaitExpr(browserStatementNode)) {
            changeCollection = u.isVariableDeclarator(browserStatementParentNode)
                ? browserStatement.closest(this._j.VariableDeclaration)
                : browserStatement.closest(this._j.ExpressionStatement);
        } else if (u.isVariableDeclarator(browserStatementNode)) {
            changeCollection = browserStatement.closest(this._j.VariableDeclaration);
        } else {
            changeCollection = browserStatement;
        }
        const changeCollectionNode = changeCollection.get().node;

        changeCollection.replaceWith(() => {
            const awaitNodes = this._transformChainingCallsToAwait({
                chainingCallPaths, browser, browserStatementNode, browserStatementParentNode, changeCollectionNode, isRunnable, browserComments, lastBrowserChaining
            });

            if (!u.isArrowFnExpr(browserStatementNode)) {
                return awaitNodes;
            }

            const hasArrowFn = awaitNodes.some(u.isArrowFnExpr);

            if (hasArrowFn) {
                return awaitNodes;
            }

            const fn = this._j.arrowFunctionExpression(browserStatementNode.params, this._j.blockStatement(awaitNodes));
            fn.async = true;

            return fn;
        });
    }

    _transformChainingCallsToAwait({chainingCallPaths, browser, browserStatementNode, browserStatementParentNode, changeCollectionNode, isRunnable, browserComments, lastBrowserChaining}) {
        const hasChainedCalls = chainingCallPaths.length > 1;

        return chainingCallPaths.flatMap((p, i, arr) => {
            const isFirstChainingCall = i === 0;
            const isLastChainingCall = i === arr.length - 1;
            const currNode = p.node;
            const prevNode = isFirstChainingCall ? null : arr[i - 1].node;
            const nextNode = isLastChainingCall ? null : arr[i + 1].node;

            u.cleanNodeComments(currNode);
            u.mvFnCallInOneLineWithExpr(p);

            p.node.callee.object = u.getBrowserObj(browser, this._options[BROWSER_NAME_OPTION]);

            const awaitNode = hasChainedCalls ? this._genAwaitNode({
                browserStatementNode,
                browserStatementParentNode,
                changeCollectionNode,
                isRunnable,
                isLastChainingCall,
                currNode,
                nextNode
            }) : p.parent.node;

            [].concat(awaitNode).forEach((node, i) => {
                const isFirstCall = _.isArray(awaitNode) ? i === 0 : isFirstChainingCall;
                const isLastCall = _.isArray(awaitNode) ? i === awaitNode.length - 1 : isLastChainingCall;

                let prevInnerNode;
                if (_.isArray(awaitNode)) {
                    prevInnerNode = isFirstCall ? prevNode : null;
                } else {
                    prevInnerNode = prevNode;
                }

                node.comments = this._setNodeComments({
                    node,
                    browserStatementNode,
                    browserStatementParentNode,
                    changeCollectionNode,
                    browserComments,
                    isFirstChainingCall: isFirstCall,
                    isLastChainingCall: isLastCall,
                    isMainLastChainingCall: isLastChainingCall,
                    lastBrowserChaining,
                    prevNode: prevInnerNode,
                    hasChainedCalls,
                    isArrayNode: _.isArray(awaitNode)
                }).sort(u.sortCommentsByStartLinePos);

                node._hasAlreadySetComments = true;
            });

            return awaitNode;
        });
    }

    _genAwaitNode({browserStatementNode, browserStatementParentNode, changeCollectionNode, isRunnable, isLastChainingCall, currNode, nextNode}) {
        const nextResolveCb = _.get(nextNode, 'arguments[0]');

        if (nextResolveCb && u.hasParams(nextResolveCb) && u.isThenNode(nextNode)) {
            return this._genAwaitNodeWithVarDecl(currNode, nextResolveCb);
        }

        if (u.isCatchNode(currNode) || u.isFinallyNode(currNode)) {
            this._warnings.addWarnToSourceCode({problemNode: currNode});
            const cb = currNode.arguments[0];

            return this._handleCallback({cb}, {isLastChainingCall, browserStatementNode, browserStatementParentNode, changeCollectionNode});
        }

        if (u.isThenNode(currNode)) {
            if (u.isCallExpr(currNode.arguments[0]) || u.isIdentifier(currNode.arguments[0]) || currNode.arguments[1]) {
                this._warnings.addWarnToSourceCode({problemNode: currNode});
            }

            const currResolveCb = currNode.arguments[0];
            const currRejectCb = currNode.arguments[1];

            const modifiedResolveCb = this._handleThenCallback({cb: currResolveCb, hasNextCb: Boolean(currRejectCb)}, {isLastChainingCall, browserStatementNode, browserStatementParentNode, changeCollectionNode});

            if (isRunnable || !isLastChainingCall) {
                this._replaceReturnNodeToAwait(modifiedResolveCb, isLastChainingCall);
            }

            if (!currRejectCb) {
                return modifiedResolveCb;
            }

            const modifiedRejectCb = this._handleThenCallback({cb: currRejectCb}, {isLastChainingCall, browserStatementNode, browserStatementParentNode, changeCollectionNode});
            return u.compactedConcat(modifiedResolveCb, modifiedRejectCb);
        }

        if (this._shouldWrapLastChainedCallToVarDecl({isLastChainingCall, browserStatementNode, browserStatementParentNode})) {
            return this._wrapLastChainedCallToVarDecl({node: currNode, browserStatementNode, browserStatementParentNode, changeCollectionNode});
        }

        if (
            isLastChainingCall && !isRunnable &&
            (u.isReturnStatement(browserStatementNode) || u.isArrowFnExpr(browserStatementNode))
        ) {
            return this._j.returnStatement(currNode);
        }

        return this._j.expressionStatement(this._j.awaitExpression(currNode));
    }

    _handleThenCallback({cb, hasNextCb = false}, {isLastChainingCall, browserStatementNode, browserStatementParentNode, changeCollectionNode}) {
        if (u.isCallExpr(cb) || u.isIdentifier(cb)) {
            if (this._shouldWrapLastChainedCallToVarDecl({isLastChainingCall, browserStatementNode, browserStatementParentNode})) {
                return this._wrapLastChainedCallToVarDecl({node: cb, browserStatementNode, browserStatementParentNode, changeCollectionNode});
            }

            return hasNextCb ? this._j.expressionStatement(this._j.awaitExpression(cb)) : this._j.returnStatement(cb);
        }

        return this._handleCallback({cb, hasNextCb}, {isLastChainingCall, browserStatementNode, browserStatementParentNode, changeCollectionNode});
    }

    _handleCallback({cb, hasNextCb = false}, {isLastChainingCall, browserStatementNode, browserStatementParentNode, changeCollectionNode}) {
        if (cb.body && cb.body.body) {
            this._replaceReturnToVariable(cb.body, {isLastChainingCall, browserStatementNode, browserStatementParentNode, changeCollectionNode});
            return cb.body.body;
        }

        if (u.isArrowFnExpr(cb)) {
            if (this._shouldWrapLastChainedCallToVarDecl({isLastChainingCall, browserStatementNode, browserStatementParentNode})) {
                return this._wrapLastChainedCallToVarDecl({node: cb.body, browserStatementNode, browserStatementParentNode, changeCollectionNode});
            }

            if (u.isAssignmentExpr(cb.body) || u.isBinaryExpr(cb.body)) {
                return this._j.expressionStatement(cb.body);
            }

            return hasNextCb ? this._j.expressionStatement(this._j.awaitExpression(cb.body)) : this._j.returnStatement(cb.body);
        }

        return _.isUndefined(cb.body)
            ? this._j.expressionStatement(this._j.awaitExpression(cb))
            : cb.body.body;
    }

    _shouldWrapLastChainedCallToVarDecl({isLastChainingCall, browserStatementNode, browserStatementParentNode}) {
        return isLastChainingCall && (
            u.isVariableDeclarator(browserStatementNode) ||
            u.isAwaitExpr(browserStatementNode) && u.isVariableDeclarator(browserStatementParentNode)
        );
    }

    _wrapLastChainedCallToVarDecl({node, browserStatementNode, browserStatementParentNode, changeCollectionNode}) {
        const {kind} = changeCollectionNode;
        const {id} = u.isVariableDeclarator(browserStatementNode) ? browserStatementNode : browserStatementParentNode;
        const init = u.isAwaitableFn(node) ? this._j.awaitExpression(node) : node;

        return this._genVarDecl({kind, id, init});
    }

    _replaceReturnNodeToAwait(node, isLastChainingCall) {
        this._j(node)
            .find(this._j.ReturnStatement)
            .replaceWith(p => {
                if (!p.node.argument) {
                    return p.node;
                }

                if (!u.isAwaitableFn(p.node.argument)) {
                    return isLastChainingCall ? p.node : this._j.expressionStatement(p.node.argument);
                }

                const wrapNode = u.isAwaitableFn(p.node.argument) ? this._j.awaitExpression(p.node.argument) : p.node.argument;
                return this._j.expressionStatement(wrapNode);
            });
    }

    _replaceReturnToVariable(node, {isLastChainingCall, browserStatementNode, browserStatementParentNode, changeCollectionNode}) {
        this._j(node)
            .find(this._j.ReturnStatement)
            .replaceWith(p => {
                if (this._shouldWrapLastChainedCallToVarDecl({isLastChainingCall, browserStatementNode, browserStatementParentNode})) {
                    return this._wrapLastChainedCallToVarDecl({node: p.node.argument, browserStatementNode, browserStatementParentNode, changeCollectionNode});
                }

                return p.node;
            });
    }

    _genAwaitNodeWithVarDecl(node, nextResolveCb) {
        let wrapNode = node;

        if (u.isThenNode(node)) {
            const resolveCb = node.arguments[0];

            if (_.isUndefined(resolveCb.body)) {
                wrapNode = resolveCb;
            } else if (_.isUndefined(resolveCb.body.body)) {
                wrapNode = resolveCb.body;
            } else {
                wrapNode = resolveCb.body.body;
            }
        }

        if (!_.isArray(wrapNode)) {
            return this._genVariableDeclaration(wrapNode, nextResolveCb.params);
        }

        return wrapNode.map(node => {
            if (!u.isReturnStatement(node)) {
                return node;
            }

            return this._genVariableDeclaration(node.argument, nextResolveCb.params);
        });
    }

    _genVariableDeclaration(node, params) {
        const id = params.length > 1 ? this._j.arrayPattern(params) : params[0];
        const init = u.isAwaitableFn(node) ? this._j.awaitExpression(node) : node;

        return this._genVarDecl({id, init});
    }

    _genVarDecl({kind = 'const', id, init}) {
        return this._j.variableDeclaration(
            kind,
            [this._j.variableDeclarator(id, init)]
        );
    }

    _setNodeComments({node, browserStatementNode, browserStatementParentNode, changeCollectionNode, browserComments, isFirstChainingCall, isLastChainingCall, isMainLastChainingCall, lastBrowserChaining, prevNode, isArrayNode}) {
        if (isFirstChainingCall && !node._hasAlreadySetComments) {
            const trailingComments = isArrayNode ? _.get(prevNode, 'trailingComments', []).map(u.switchCommentPosition) : [];
            let leadingComments = isArrayNode ? [] : u.isAwaitExpr(browserStatementNode) ? browserStatementParentNode.leadingComments : browserStatementNode.leadingComments;

            if (u.isVariableDeclaration(changeCollectionNode)) {
                leadingComments = _.concat(leadingComments, changeCollectionNode.leadingComments);
            }

            return _.uniq(u.compactedConcat(node.comments, leadingComments, browserComments, trailingComments));
        }

        const trailingComments = _.get(prevNode, 'trailingComments', []);
        const prevNodeComments = _.isEmpty(trailingComments) ? [] : trailingComments.map(u.switchCommentPosition);
        let lastBroComments = [];

        if (lastBrowserChaining && isLastChainingCall && isMainLastChainingCall) {
            if (u.isAwaitExpr(browserStatementNode)) {
                lastBroComments = browserStatementParentNode.trailingComments;
            } else {
                lastBroComments = browserStatementNode.trailingComments;
            }

            if (u.isVariableDeclaration(changeCollectionNode)) {
                lastBroComments = _.concat(lastBroComments, changeCollectionNode.trailingComments);
            }
        }

        return _.uniq(u.compactedConcat(node.comments, prevNodeComments, lastBroComments));
    }

    _removeUnnecessaryReturns(fnNode, isRunnable) {
        // for correctly work with arrow function in one line (used fnNode.body)
        const fnBody = fnNode.body && fnNode.body.body ? fnNode.body.body : _.concat([], fnNode.body);

        const returnStatements = fnBody.reduce((acc, node, index) => {
            if (!u.isReturnStatement(node)) {
                return acc;
            }

            if (u.isConditionalExpr(node.argument)) {
                node.argument.extra = {...node.argument.extra, parenthesized: true};
            }

            return _.concat(acc, {index, node});
        }, []);

        if (returnStatements.length < 2 && !isRunnable) {
            return;
        }

        const modifyReturns = isRunnable ? returnStatements : _.initial(returnStatements);

        modifyReturns.forEach(({index: returnIndex, node}, arrInd, arr) => {
            const isLastReturn = arr.length - 1 === arrInd;
            if (!u.isAwaitableFn(node.argument) && isLastReturn) {
                return;
            }

            const wrapNode = u.isAwaitableFn(node.argument) ? this._j.awaitExpression(node.argument) : node.argument;
            fnBody[returnIndex] = this._j.expressionStatement(wrapNode);
            fnBody[returnIndex].comments = node.comments; // to not lose comments
        });
    }

    _removeAwaitFromPassedNodes(fnNode) {
        const optionVal = this._options[NOT_AWAIT_OPTION];

        if (!optionVal) {
            return;
        }

        const noAwait = _.isString(optionVal) ? optionVal.split(',') : _.concat(optionVal);

        this._j(fnNode)
            .find(this._j.AwaitExpression, node => {
                const calleeName = _.get(node, 'argument.callee.name');
                const calleeObjName = _.get(node, 'argument.callee.object.name');
                return _.intersection(noAwait, [calleeName, calleeObjName]).length > 0;
            })
            .replaceWith(p => p.node.argument);
    }
};
