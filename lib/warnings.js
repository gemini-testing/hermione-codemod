'use strict';

const _ = require('lodash');
const chalk = require('chalk');
const u = require('./utils');
const {REMOVE_BROWSER_PROP_MODE} = require('./constants');

module.exports = class Warnings {
    static create(...args) {
        return new this(...args);
    }

    constructor(j, filePath, transformMode) {
        this._j = j;
        this._filePath = filePath;
        this._transformMode = transformMode;
        this._warnings = new Map();
    }

    showAll() {
        const sortedWarns = _.sortBy([...this._warnings.values()], w => {
            return _.isArray(w.position)
                ? w.position[0].start + w.position[0].end
                : w.position.start + w.position.end;
        });

        if (_.isEmpty(sortedWarns)) {
            return;
        }

        console.warn(`\n${chalk.yellow(`Found ${sortedWarns.length} warnings inside ${this._filePath}`)}:\n`);

        sortedWarns.forEach((warn, i) => {
            console.warn(`${chalk.yellow(`WARN #${i + 1}:`)} ${warn.msg}\n` +
                `problem code: ${warn.sourceCode}\n` +
                `lines before transform: ${JSON.stringify(warn.position)}\n`
            );
        });
    }

    addWarnToSourceCode({problemNode, parentNode, propName}) {
        if (this._transformMode === REMOVE_BROWSER_PROP_MODE) {
            if (u.isObjectPattern(problemNode)) {
                this._handleWarn({
                    problemNode,
                    parentNode,
                    warnMsg: `find usage of "${propName}" identifier with other properties inside object pattern, fix it manually`
                });
            }

            return;
        }

        if (u.isThenNode(problemNode)) {
            const [resolveCb, rejectCb] = problemNode.arguments;
            const calleePropName = problemNode.callee.property.name;

            if (rejectCb) {
                this._handleWarn({
                    problemNode: rejectCb,
                    parentNode: problemNode,
                    warnMsg: `can't correctly transform "onRejected" callback inside "${calleePropName}", fix it manually`
                });
            }

            if (u.isCallExpr(resolveCb) || u.isIdentifier(resolveCb)) {
                this._handleWarn({
                    problemNode: resolveCb,
                    parentNode: problemNode,
                    warnMsg: `found "${resolveCb.type}" node inside then, maybe you should fix it manually`
                });
            }

            return;
        }

        if (u.isCatchNode(problemNode) || u.isFinallyNode(problemNode)) {
            const cb = problemNode.arguments[0];
            const calleePropName = problemNode.callee.property.name;

            this._handleWarn({
                problemNode: cb,
                parentNode: problemNode,
                warnMsg: `can't correctly transform "${calleePropName}" node, fix it manually`
            });

            return;
        }

        if (u.isLogicalExpr(problemNode) || u.isConditionalExpr(problemNode)) {
            this._handleWarn({
                problemNode,
                parentNode,
                warnMsg: `can't correctly transform "${problemNode.type}" node, fix it manually`
            });

            return;
        }
    }

    _handleWarn({problemNode, parentNode, warnMsg}) {
        if (this._warnings.has(problemNode)) {
            return;
        }

        this._addInfo(problemNode, warnMsg);
        this._addSyntaxErrors(problemNode, parentNode);
    }

    _addInfo(node, msg) {
        const position = _.isArray(node) ? node.map(u.getNodePosition) : u.getNodePosition(node);
        const sourceCode = this._j(node).toSource();

        this._warnings.set(node, {msg, position, sourceCode});
    }

    _addSyntaxErrors(problemNode, parentNode) {
        if (problemNode.body && problemNode.body.body) {
            return this._j(problemNode)
                .find(this._j.BlockStatement)
                .replaceWith(p => {
                    return _.set(p.node, 'body', this._wrapInSyntaxErrors(...p.node.body));
                });
        }

        if (u.isArrowFnExpr(problemNode)) {
            return this._j(parentNode)
                .find(this._j.ArrowFunctionExpression)
                .replaceWith(p => {
                    const wrapNode = this._j.expressionStatement(p.node.body);
                    return _.set(p.node, 'body', this._j.blockStatement(this._wrapInSyntaxErrors(wrapNode)));
                });
        }

        if (u.isLogicalExpr(problemNode) || u.isConditionalExpr(problemNode)) {
            return parentNode
                .closestSome([this._j.ReturnStatement, this._j.ArrowFunctionExpression, this._j.ExpressionStatement])
                .replaceWith(p => {
                    if (u.isArrowFnExpr(p.node)) {
                        const wrapNode = this._j.expressionStatement(p.node.body);
                        return _.set(p.node, 'body', this._j.blockStatement(this._wrapInSyntaxErrors(wrapNode)));
                    }

                    return this._wrapInSyntaxErrors(p.node);
                });
        }

        if (u.isObjectPattern(problemNode)) {
            return parentNode
                .closest(this._j.VariableDeclaration)
                .replaceWith(p => this._wrapInSyntaxErrors(p.node));
        }

        this._j(parentNode)
            .find(problemNode.type, u.filterNodes(problemNode))
            .replaceWith(p => {
                const wrapNode = this._j.expressionStatement(p.node);

                return this._j.functionExpression(
                    this._j.identifier(''),
                    [],
                    this._j.blockStatement(this._wrapInSyntaxErrors(wrapNode))
                );
            });
    }

    _wrapInSyntaxErrors(...nodes) {
        const upperSyntaxErr = this._genSyntaxError('fix code below manually');
        const bottomSyntaxErr = this._genSyntaxError('fix code above manually');
        this._syntaxErrCounter++;

        return [
            upperSyntaxErr,
            ...nodes,
            bottomSyntaxErr
        ];
    }

    _genSyntaxError(msg) {
        return this._j.expressionStatement(
            this._j.callExpression(
                this._j.identifier('static Error'),
                [this._j.literal(`hermione-codemod_${this._warnings.size}: ${msg}`)]
            )
        );
    }
};
