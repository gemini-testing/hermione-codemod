'use strict';

exports.FN_DECL = 'FunctionDeclaration';
exports.CLASS_DECL = 'ClassDeclaration';
exports.VARIABLE_DECLARATION = 'VariableDeclaration';
exports.VARIABLE_DECLARATOR = 'VariableDeclarator';

exports.FN_EXPR = 'FunctionExpression';
exports.ARROW_FN_EXPR = 'ArrowFunctionExpression';
exports.CALL_EXPR = 'CallExpression';
exports.AWAIT_EXPR = 'AwaitExpression';
exports.LOGICAL_EXPR = 'LogicalExpression';
exports.CONDITIONAL_EXPR = 'ConditionalExpression';
exports.ASSIGNMENT_EXPR = 'AssignmentExpression';
exports.BINARY_EXPR = 'BinaryExpression';
exports.THIS_EXPR = 'ThisExpression';
exports.MEMBER_EXPR = 'MemberExpression';

exports.BLOCK_STATEMENT = 'BlockStatement';
exports.RETURN_STATEMENT = 'ReturnStatement';
exports.EXPRESSION_STATEMENT = 'ExpressionStatement';
exports.IF_STATEMENT = 'IfStatement';
exports.IDENTIFIER = 'Identifier';
exports.OBJECT_PATTERN = 'ObjectPattern';

exports.THEN = 'then';
exports.CATCH = 'catch';
exports.FINALLY = 'finally';

exports.FN_TYPES = [exports.FN_EXPR, exports.FN_DECL, exports.ARROW_FN_EXPR, exports.CLASS_DECL];

exports.RUNNABLE_NAMES = ['it', 'beforeEach', 'afterEach'];

exports.BROWSER_CHAINING_MODE = 'browser-chaining-mode';
exports.REMOVE_BROWSER_PROP_MODE = 'remove-browser-prop-mode';

exports.BROWSER_NAME_OPTION = 'browser-name';
exports.NOT_AWAIT_OPTION = 'not-await';
exports.BREAK_CHAINING_ON_OPTION = 'break-chaining-on';
exports.PROPERTY_NAME_OPTION = 'property-name';

exports.DEFAULT_OPTIONS = {
    printOptions: {tabWidth: 4},
    [exports.BROWSER_NAME_OPTION]: ['browser'],
    [exports.NOT_AWAIT_OPTION]: ['assert', 'should', 'expect'],
    [exports.BREAK_CHAINING_ON_OPTION]: ['assert', 'should', 'expect'],
    [exports.PROPERTY_NAME_OPTION]: 'value'
};
