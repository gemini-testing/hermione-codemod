'use strict';

beforeEach(async function() {
    const {browser} = this;

    await browser.foo();
    await browser.bar();
    await browser.baz();
});

afterEach(async function() {
    const {browser} = this;

    await browser.foo();
    await browser.bar();
    await browser.baz();
});

it('should do nothing if "browser" is not used', function() {
    return this.some.foo().bar().baz();
});

it('should make runnable async even if call with one browser command', async function() {
    await this.browser.foo();
});

it('should split chained browser commands (in one line) with await', async function() {
    const {browser} = this;

    await browser.foo();
    await browser.bar();
    await browser.baz();
});

it('should split chained browser commands (in few lines) with await', async function() {
    await this.browser.foo();
    await this.browser.bar();
    await this.browser.baz();
});

it('should not lose commens of chained browser commands in few lines', async function() {
    // before chaining
    // before call foo
    await this.browser.foo();

    // before call bar
    await this.browser.bar();

    // before call baz
    await this.browser.baz();
});

it('should correctly split browser commands passed inside callback to another browser command', async function() {
    await this.browser.foo('some-value');

    await this.browser.bar('another-value', async () => {
        await this.browser.baz();
        return this.browser.qux();
    });
});

it('should correctly handle mixed use of browser (await and chain)', async function() {
    await foo(this.browser);

    await this.browser.bar();
    await this.browser.baz();
});

it('should correctly handle case when called inlined function in then', async function() {
    await this.browser.foo();
    const data = await someFn(this.browser);
    await this.browser.bar(data);
});

it('should add parenthesizes around conditional expression', async function() {
    const res = await this.browser.foo();
    await (res === 'boom' ? bar() : baz());
});

it('should replace return node to await inside "then" and "if" statement', async function() {
    await this.browser.foo();
    if (a) {
        await bar();
    } else {
        await baz();
    }
});

it('should replace return of browser call to await inside "then" and "if" statement', async function() {
    await this.browser.foo();
    if (a) {
        await this.browser.bar();
    } else {
        await this.browser.baz();
    }
    await this.browser.qux();
});

/**
 * USING ASYNC
 */

it('should split chained browser commands to async-await calls', async function() {
    await browser.foo();
    await browser.bar();
    await browser.baz();
});

it('should split chained browser commands with "then" to async-await calls', async function() {
    await browser.foo();
    await bar();
});

it('should set result to variable from last call', async function () {
    await browser.foo();
    await browser.bar();
    const res = await browser.baz();
});

it('should set result to variable from last call with using then', async function () {
    await browser.foo();
    const res = await bar();
});

it('should set result to variable from last call and do nothing with assignment expression', async function () {
    await browser.foo();
    a = b;
    bar();
    const res = await baz();
});

it('should set result to variable from last call and do nothing with binary expression', async function () {
    await browser.foo();
    const equal = a === b;
    const res = await browser.bar(equal);
});

/**
 * COMMENTS
 */

it('should not lose comments around browser chaining calls', async function() {
    // line1
    await this.browser.foo();

    await this.browser.bar();

    // line2

    // line3
    await this.browser.baz();

    await this.browser.qux();
    // line4
});

it('should not lose comments around browser chaining calls with then', async function() {
    // line1
    await this.browser.foo();

    // line2
    await this.browser.bar();

    await this.browser.baz();
    // line3

    await this.browser.qux();
    // line4
});

it('should not lose comments around browser chaining calls with variable declaration', async function() {
    // line1
    await this.browser.foo();

    // line2
    await this.browser.bar();

    await this.browser.baz();
    // line3

    const res = await this.browser.qux();
    // line4
});

it('should not lose comments around browser chaining calls with async-await', async function() {
    // line1
    await this.browser.foo();

    await this.browser.bar();

    // line2

    // line3
    await this.browser.baz();

    await this.browser.qux();
    // line4
});

it('should not lose comments around browser chaining calls with async-await and then', async function() {
    // line1
    await this.browser.foo();

    // line2
    await this.browser.bar();

    await this.browser.baz();
    // line3

    await this.browser.qux();
    // line4
});

it('should not lose comments around browser chaining calls with async-await and variable declaration', async function() {
    // line1
    await this.browser.foo();

    const res = await this.browser.bar();
    // line2
    await this.browser.baz()
});

it('should not lose comments around browser chaining calls with async-await, variable declaration and few sequential then', async function() {
    // line1
    await this.browser.foo();

    const res = await this.browser.bar();

    // line2
    await this.browser.baz();

    // line3
    // line4
    await this.browser.qux();

    await this.browser.ss();
    // line5

    // line6
    // line7
    await this.browser.w();

    await this.browser.c();
    // line8
    // line9
});
