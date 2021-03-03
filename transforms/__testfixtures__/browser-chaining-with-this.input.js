'use strict';

/**
 * using FunctionExpression
 */

// should split chained browser commands with await and use this
(function() {
    this.foo().bar().baz();
})();

// should remove then and await only first browser command
(function() {
    return this.foo()
        .then(function() {
            return this.bar();
        })
})();
