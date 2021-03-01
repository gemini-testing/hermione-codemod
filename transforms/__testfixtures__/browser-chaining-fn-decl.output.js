'use strict';

// should do nothing if "browser" identifier is not used
function some_1() {
    foo();
}

// should do nothing if there are no chained calls of browser commands
function some_2() {
    this.browser.foo();
    this.browser.bar();
}

// should split chained browser commands with await and use browser with this
async function some_3() {
    await this.browser.foo();
    await this.browser.bar();
    await this.browser.baz();
}

// should split chained browser commands with await and use browser without this
async function some_4() {
    const {browser} = this;

    await browser.foo();
    await browser.bar();
    await browser.baz();
}

// should split only chained browser commands and do nothing with calls without chaining
async function some_5() {
    await this.browser.foo();
    await this.browser.bar();

    this.browser.baz();
}

// should correctly split chained browser commands wrapped in additional function
function some_6() {
    async function some_6_1() {
        await this.browser.foo();
        await this.browser.bar();
        await this.browser.baz();
    }
}

// should correctly split chained browser commands specified in few lines
async function some_7() {
    await this.browser.foo();
    await this.browser.bar();
    await this.browser.baz();
}

// should correctly split only chained browser commands and save comments in right place
async function some_8() {
    // before foo
    await this.browser.foo();

    await this.browser.bar();

    // before baz
    return this.browser.baz();
}

// should correctly split chained browser commands specified in few lines with comments
async function some_9() {
    // before chaining
    // before use browser
    // before call foo
    await this.browser.foo();

    // before call bar
    await this.browser.bar();

    // before call baz
    await this.browser.baz();
}

// should move return statement to the last call without await
async function some_10() {
    await this.browser.foo();
    await this.browser.bar();
    return this.browser.baz();
}

// should move variable declaration with "var" to the last call
async function some_11() {
    await this.browser.foo();
    await this.browser.bar();
    var result1 = await this.browser.baz();
}

// should move variable declaration with "let" to the last call
async function some_12() {
    await this.browser.foo();
    await this.browser.bar();
    let result2 = await this.browser.baz();
}

// should move variable declaration with "const" to the last call
async function some_13() {
    await this.browser.foo();
    await this.browser.bar();
    const result3 = await this.browser.baz();
}

// should move variable declaration with destructuring to the last call
async function some_14() {
    await this.browser.foo();
    await this.browser.bar();
    const {some} = await this.browser.baz();
}

// should handle the case when browser is used multiple times (with if statement)
async function some_15() {
    const {browser} = this;

    if (someIfStatement) {
        await browser.foo();
        return browser.bar();
    }

    await this.browser.foz();
    return this.browser.qux();
}

// should handle the case when callback is used inside browser commands
async function some_16() {
    const {browser} = this;

    await browser.foo();

    return browser.bar(async function some_16_1() {
        await this.browser.baz();
        return this.browser.qux();
    });
}

/**
 * USING ASYNC
 */

// should do nothing with async-await calls without chaining browser commands
async function some_17() {
    await this.browser.foo();
    await this.browser.bar();
}

// should split chained browser commands with async-await calls
async function some_18() {
    await this.browser.foo();
    await this.browser.bar();
}

// should do nothing with async-await calls but transform without
async function some_19() {
    await this.browser.foo();

    await this.browser.foo();
    await this.browser.bar();
}

// should correctly save comments with async-await and browser chained commands
async function some_20() {
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
}

/**
 * USING PROMISES
 */

// should remove then and await only first browser command
async function some_21() {
    await this.browser.foo();
    this.browser.bar();
}

// should remove then and return call of browser command from it
async function some_22() {
    await this.browser.foo();
    return this.browser.bar();
}

// should remove then and split browser commands from it
async function some_23() {
    await this.browser.foo();
    await this.browser.bar();
    return this.browser.baz();
}

// should remove then and correctly use comments
async function some_24() {
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
}

// should correctly save comments before few then
async function some_25() {
    await this.browser.foo();

    // before then #1
    // before call baz
    await this.browser.baz();

    // before then #2
    // before call qux
    return this.browser.qux();
}

// should remove all then calls and return only the last browser call
async function some_26() {
    await this.browser.foo();
    await this.browser.bar();
    await this.browser.baz();
    await this.browser.qux();
    return this.browser.boom();
}

// should correctly handle the case with few nested then calls
async function some_27() {
    await this.browser.foo();
    await this.browser.bar();
    await this.browser.baz();
    return this.browser.qux();
}

// should correctly handle the case with one parameter in then call
async function some_28() {
    const val = await this.browser.foo();
    return this.browser.bar(val);
}

// should correctly handle the case with one parameter as object in then call
async function some_29() {
    const {val} = await this.browser.foo();
    return this.browser.bar(val);
}

// should correctly handle the case with few parameters in then call
async function some_30() {
    const [v1, v2] = await this.browser.foo();
    return this.browser.bar(v1, v2);
}

// should correctly handle the case with few thens with parameters and browser chaining calls
async function some_31() {
    const a = await this.browser.foo();
    await this.browser.bar(a);
    const b = await this.browser.baz();
    await this.browser.qux(b);
    const [c, d] = await this.browser.qwe();
    return this.browser.rty(c, d);
}

// should correctly handle the case with bind inside then (bind not called)
async function some_32() {
    await this.browser.foo();
    return foo.bind(this.browser);
}

// should not fail when onRejected callback is passed to then (TODO: fix it with transform to try catch)
async function some_33() {
    await this.browser.foo();
    return this.browser.bar();
    throw new Error('o.O');
}

// should not fail when catch is used in browser chaining (TODO: fix it with transform to try catch)
async function some_34() {
    await this.browser.foo();
    throw new Error('o.O');
}

// should not fail when finally is used in browser chaining (TODO: fix it with transform to try finally)
async function some_35() {
    await this.browser.foo();
    return this.browser.bar();
}
