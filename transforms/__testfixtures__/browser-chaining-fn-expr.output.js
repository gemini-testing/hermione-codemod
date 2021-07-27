'use strict';

// should do nothing if "browser" identifier is not used
(function() {
    foo();
})();

// should do nothing if there are no chained calls of browser commands
(function() {
    this.browser.foo();
    this.browser.bar();
})();

// should split chained browser commands with await and use browser with this
(async function() {
    await this.browser.foo();
    await this.browser.bar();
    await this.browser.baz();
})();

// should split chained browser commands with await and use browser without this
(async function() {
    const {browser} = this;

    await browser.foo();
    await browser.bar();
    await browser.baz();
})();

// should split only chained browser commands and do nothing with calls without chaining
(async function() {
    await this.browser.foo();
    await this.browser.bar();

    this.browser.baz();
})();

// should correctly split chained browser commands wrapped in additional function
(function() {
    (async function() {
        await this.browser.foo();
        await this.browser.bar();
        await this.browser.baz();
    })();
})();

// should correctly split chained browser commands specified in few lines
(async function() {
    await this.browser.foo();
    await this.browser.bar();
    await this.browser.baz();
})();

// should correctly split only chained browser commands and save comments in right place
(async function() {
    // before foo
    await this.browser.foo();

    await this.browser.bar();

    // before baz
    return this.browser.baz();
})();

// should correctly split chained browser commands specified in few lines with comments
(async function() {
    // before chaining
    // before use browser
    // before call foo
    await this.browser.foo();

    // before call bar
    await this.browser.bar();

    // before call baz
    await this.browser.baz();
})();

// should move return statement to the last call without await
(async function() {
    await this.browser.foo();
    await this.browser.bar();
    return this.browser.baz();
})();

// should move variable declaration with "var" to the last call
(async function() {
    await this.browser.foo();
    await this.browser.bar();
    var result1 = await this.browser.baz();
})();

// should move variable declaration with "let" to the last call
(async function() {
    await this.browser.foo();
    await this.browser.bar();
    let result2 = await this.browser.baz();
})();

// should move variable declaration with "const" to the last call
(async function() {
    await this.browser.foo();
    await this.browser.bar();
    const result3 = await this.browser.baz();
})();

// should move variable declaration with destructuring to the last call
(async function() {
    await this.browser.foo();
    await this.browser.bar();
    const {some} = await this.browser.baz();
})();

// should handle the case when browser is used multiple times (with if statement)
(async function() {
    const {browser} = this;

    if (someIfStatement) {
        await browser.foo();
        return browser.bar();
    }

    await this.browser.foz();
    return this.browser.qux();
})();

// should handle the case when callback is used inside browser commands
(async function() {
    const {browser} = this;

    await browser.foo();

    return browser.bar(async function() {
        await this.browser.baz();
        return this.browser.qux();
    });
})();

/**
 * USING ASYNC
 */

// should do nothing with async-await calls without chaining browser commands
(async function() {
    await this.browser.foo();
    await this.browser.bar();
})();

// should split chained browser commands with async-await calls
(async function() {
    await this.browser.foo();
    await this.browser.bar();
})();

// should do nothing with async-await calls but transform without
(async function() {
    await this.browser.foo();

    await this.browser.foo();
    await this.browser.bar();
})();

// should correctly save comments with async-await and browser chained commands
(async function() {
    // before foo
    await this.browser.foo();

    // before bar
    await this.browser.bar();

    // before then
    // before baz
    await this.browser.baz();

    // before qux
    await this.browser.qux();

    // before boom
    return this.browser.boom();
})();

/**
 * USING PROMISES
 */

// should remove then and await only first browser command
(async function() {
    await this.browser.foo();
    this.browser.bar();
})();

// should remove then and return call of browser command from it
(async function() {
    await this.browser.foo();
    return this.browser.bar();
})();

// should remove then and split browser commands from it
(async function() {
    await this.browser.foo();
    await this.browser.bar();
    return this.browser.baz();
})();

// should remove then and correctly use comments
(async function() {
    // before chaining
    // before use browser #1
    // before call foo
    await this.browser.foo();

    // before call then #1
    // before call then #2
    // before use browser #2
    // before call bar
    await this.browser.bar();

    // before call baz
    return this.browser.baz();
})();

// should correctly save comments before few then
(async function() {
    await this.browser.foo();

    // before then #1
    // before call baz
    await this.browser.baz();

    // before then #2
    // before call qux
    return this.browser.qux();
})()

// should remove all then calls and return only the last browser call
(async function() {
    await this.browser.foo();
    await this.browser.bar();
    await this.browser.baz();
    await this.browser.qux();
    return this.browser.boom();
})();

// should correctly handle the case with few nested then calls
(async function() {
    await this.browser.foo();
    await this.browser.bar();
    await this.browser.baz();
    return this.browser.qux();
})();

// should correctly handle the case with one parameter in then call
(async function() {
    const val = await this.browser.foo();
    return this.browser.bar(val);
})();

// should correctly handle the case with one parameter as object in then call
(async function() {
    const {val} = await this.browser.foo();
    return this.browser.bar(val);
})();

// should correctly handle the case with few parameters in then call
(async function() {
    const [v1, v2] = await this.browser.foo();
    return this.browser.bar(v1, v2);
})();

// should correctly handle the case with few thens with parameters and browser chaining calls
(async function() {
    const a = await this.browser.foo();
    await this.browser.bar(a);
    const b = await this.browser.baz();
    await this.browser.qux(b);
    const [c, d] = await this.browser.qwe();
    return this.browser.rty(c, d);
})();

// should replace return node to await inside "then" (not last in chaining) and "if" statement
(async function() {
    await this.browser.foo();
    if (a) {
        await bar();
    } else {
        await baz();
    }
    if (b) {
        return qux();
    }
})();

// should not replace return node without value to await inside "then"
(async function() {
    await this.browser.foo();
    if (a) {
        return;
    }
    if (b) {
        return;
    }
})();

// should not replace return node inside last then
(async function() {
    await this.browser.foo();
    return bar();
})();

// should not replace return node inside not last then when using with not awaitable expression
(async function() {
    await this.browser.foo();
    const val = {a: 'b'};
    return val;
})();

// should not replace return node inside callback of browser command when using with not awaitable expression
(async function() {
    const val = await this.browser.foo(() => {
        return 12345;
    });

    return val + 1;
})();

// should replace return node to await inside not last then when using with identifier
(async function() {
    const p = Promise.resolve();

    await this.browser.foo();
    const val = await p;
    return val;
})();

// should replace return node to await inside not last then when using with member expression
(async function() {
    const a = {b: Promise.resolve()};

    await this.browser.foo();
    const val = await a.b;
    return val;
})();

// should not add await node to not awaitable expression
(async function() {
    await this.browser.foo();
    var result = 'foo';
})();
