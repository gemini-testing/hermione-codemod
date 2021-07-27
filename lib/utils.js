'use strict';

const _ = require('lodash');
const c = require('./constants');

const isFnDecl = node => node.type === c.FN_DECL;
const isVariableDeclaration = node => node.type === c.VARIABLE_DECLARATION;
const isVariableDeclarator = node => node.type === c.VARIABLE_DECLARATOR;

const isFnExpr = node => node.type === c.FN_EXPR;
const isArrowFnExpr = node => node.type === c.ARROW_FN_EXPR;
const isCallExpr = node => node.type === c.CALL_EXPR;
const isAwaitExpr = node => node.type === c.AWAIT_EXPR;
const isLogicalExpr = node => node.type === c.LOGICAL_EXPR;
const isConditionalExpr = node => node.type === c.CONDITIONAL_EXPR;
const isAssignmentExpr = node => node.type === c.ASSIGNMENT_EXPR;
const isBinaryExpr = node => node.type === c.BINARY_EXPR;
const isThisExpr = node => node.type === c.THIS_EXPR;
const isMemberExpr = node => node.type === c.MEMBER_EXPR;

const isReturnStatement = node => node.type === c.RETURN_STATEMENT;
const isIdentifier = node => node.type === c.IDENTIFIER;
const isObjectPattern = node => node.type === c.OBJECT_PATTERN;

const isThenNode = node => _.get(node, 'callee.property.name') === c.THEN;
const isCatchNode = node => _.get(node, 'callee.property.name') === c.CATCH;
const isFinallyNode = node => _.get(node, 'callee.property.name') === c.FINALLY;

const sortByFarthestPosition = fns => {
    return fns.sort((fn1, fn2) => fn2.node.start - fn1.node.start);
};

const isRunnableFn = node => {
    if (!node.callee) {
        return false;
    }

    return c.RUNNABLE_NAMES.some(name => {
        // check prop name in case when used some custom helpers like "h.it"
        return _.get(node, 'callee.name') === name || _.get(node, 'callee.property.name') === name;
    });
};

const isAwaitableFn = node => {
    return [isCallExpr, isIdentifier, isMemberExpr].some(fn => fn(node));
};

const isBrowserExpr = (node, useBrowserName) => {
    const browserNames = _.isString(useBrowserName) ? useBrowserName.split(',') : _.concat(useBrowserName);

    return browserNames.some(name => {
        if (name === 'this') {
            return isThisExpr(node.object);
        }

        return isIdentifier(node.object) && _.get(node, 'object.name') === name
            || isThisExpr(node.object) && isIdentifier(node.property) && _.get(node, 'property.name') === name;
    });
};

const isBrowserPassedAsArg = browser => {
    return _.get(browser, 'parent.node.arguments', []).some((arg) => arg === browser.node);
};

const isChainingCall = nodePath => nodePath.node && isCallExpr(nodePath.node);

const hasBrowserChainedCalls = browserExps => {
    return _.flatMap(browserExps, 'chainingCalls')
        .map(collection => collection.paths().length)
        .some(callsNum => callsNum > 1);
};

const mkFnAsync = node => {
    if (!node.async) {
        node.async = true;
    }
};

const removeDuplicateParenthesesForIIFE = node => {
    if (isFnExpr(node) && node.extra) {
        node.extra.parenthesized = false;
    }
};

const switchCommentPosition = c => {
    c.leading = !c.leading;
    c.trailing = !c.trailing;

    return c;
};

const compactedConcat = (...args) => _.compact(_.concat(...args));

const cleanNodeComments = nodes => {
    _.concat(nodes).forEach(n => {
        n.comments = [];
    });
};

const getNodePosition = node => ({start: node.loc.start.line, end: node.loc.end.line});

const mvFnCallInOneLineWithExpr = p => {
    if (p.node.loc.start.line !== p.node.loc.end.line) {
        p.node.callee.start = 0;
    }
};

const getBrowserObj = (browser, useBrowserName) => {
    if (!isThisExpr(browser.node.object)) {
        return browser.node.object;
    }

    return useBrowserName.includes('this') && !useBrowserName.includes(browser.node.property.name)
        ? browser.node.object
        : browser.node;
};

const hasParams = node => !_.isEmpty(node.params);
const hasRejectCb = node => _.get(node, 'arguments').length > 1;

const sortCommentsByStartLinePos = (c1, c2) => {
    return c1.loc.start.line - c2.loc.start.line;
};

const getPropsToFindNode = node => {
    return _(node)
        .pick(['type', 'name', 'start', 'end'])
        .omitBy(_.isUndefined)
        .value();
};

const filterNodes = node => {
    if (isIdentifier(node)) {
        return getPropsToFindNode(node);
    }

    if (isMemberExpr(node)) {
        return {
            object: getPropsToFindNode(node.object),
            property: getPropsToFindNode(node.property)
        };
    }

    if (isCallExpr(node)) {
        return {callee: filterNodes(node.callee)};
    }

    return {};
};

module.exports = {
    isFnDecl,
    isVariableDeclaration,
    isVariableDeclarator,

    isFnExpr,
    isArrowFnExpr,
    isCallExpr,
    isAwaitExpr,
    isLogicalExpr,
    isConditionalExpr,
    isAssignmentExpr,
    isBinaryExpr,
    isThisExpr,
    isMemberExpr,

    isReturnStatement,
    isIdentifier,
    isObjectPattern,

    isThenNode,
    isCatchNode,
    isFinallyNode,

    sortByFarthestPosition,
    isRunnableFn,
    isAwaitableFn,
    isBrowserExpr,
    isBrowserPassedAsArg,
    isChainingCall,
    hasBrowserChainedCalls,

    mkFnAsync,
    removeDuplicateParenthesesForIIFE,
    switchCommentPosition,
    compactedConcat,
    cleanNodeComments,
    getNodePosition,
    mvFnCallInOneLineWithExpr,
    getBrowserObj,
    hasParams,
    hasRejectCb,
    sortCommentsByStartLinePos,

    filterNodes
};
