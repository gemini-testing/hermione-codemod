'use strict';

/**
 * using FunctionExpression
 */

// should split chained browser commands with await and use this
(async function() {
    await this.foo();
    await this.bar();
    await this.baz();
})();

// should remove then and await only first browser command
(async function() {
    await this.foo();
    return this.bar();
})();
