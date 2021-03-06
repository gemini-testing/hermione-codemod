'use strict';

exports.FN_DECL = 'FunctionDeclaration';
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

exports.RETURN_STATEMENT = 'ReturnStatement';
exports.IDENTIFIER = 'Identifier';

exports.THEN = 'then';
exports.CATCH = 'catch';
exports.FINALLY = 'finally';

exports.FN_TYPES = [exports.FN_EXPR, exports.FN_DECL, exports.ARROW_FN_EXPR];

exports.RUNNABLE_NAMES = ['it', 'beforeEach', 'afterEach'];

exports.DEFAULT_PRINT_OPTS = {tabWidth: 4};
exports.DEFAULT_BROWSER_NAMES = ['browser'];
exports.DEFAULT_PROP_NAME = 'value';

exports.BROWSER_NAME_OPTION = 'browser-name';
exports.NO_AWAIT_OPTION = 'no-await';
exports.PROPERTY_NAME_OPTION = 'property-name';
