'use strict';

beforeEach(function() {
    const {browser} = this;

    return browser.foo().bar().baz();
});

afterEach(function() {
    const {browser} = this;

    return browser.foo().bar().baz();
});

it('should do nothing if "browser" is not used', function() {
    return some.foo().bar().baz();
});

it('should make runnable async even if call with one browser command', function() {
    return this.browser.foo();
});

it('should split chained browser commands (in one line) with await', function() {
    const {browser} = this;

    return browser.foo().bar().baz();
});

it('should split chained browser commands (in few lines) with await', function() {
    return this.browser
        .foo()
        .bar()
        .baz();
});

it('should not lose commens of chained browser commands in few lines', function() {
    // before chaining
    return this.browser
        // before call foo
        .foo()
        // before call bar
        .bar()
        // before call baz
        .baz();
});

it('should correctly split browser commands passed inside callback to another browser command', function() {
    return this.browser.foo('some-value')
        .bar(
            'another-value',
            () => {
                return this.browser.baz().qux();
            }
        )
});

it('should correctly handle mixed use of browser (await and chain)', async function() {
    await foo(this.browser);

    return this.browser
        .bar()
        .baz();
});

it('should correctly handle case when called inlined function in then', function() {
    return this.browser
        .foo()
        .then(() => someFn(this.browser))
        .then(data => this.browser.bar(data));
});

it('should add parenthesizes around conditional expression', function() {
    return this.browser
        .foo()
        .then(res => {
            return res === 'boom' ? bar() : baz();
        });
});

it('should replace return node to await inside "then" and "if" statement', function() {
    return this.browser
        .foo()
        .then(() => {
            if (a) {
                return bar();
            } else {
                return baz();
            }
        });
});

it('should replace return of browser call to await inside "then" and "if" statement', function() {
    return this.browser
        .foo()
        .then(() => {
            if (a) {
                return this.browser.bar();
            } else {
                return this.browser.baz();
            }
        })
        .qux();
});

/**
 * USING ASYNC
 */

it('should split chained browser commands to async-await calls', async function() {
    await browser.foo().bar().baz();
});

it('should split chained browser commands with "then" to async-await calls', async function() {
    await browser.foo().then(bar());
});

it('should set result to variable from last call', async function () {
    const res = await browser.foo().bar().baz();
});

it('should set result to variable from last call with using then', async function () {
    const res = await browser.foo()
        .then(() => bar());
});

it('should set result to variable from last call and do nothing with assignment expression', async function () {
    const res = await browser.foo()
        .then(() => a = b)
        .then(() => {
            bar();
            return baz();
        });
});

it('should set result to variable from last call and do nothing with binary expression', async function () {
    const res = await browser.foo()
        .then(function() {
            return a === b;
        })
        .then(function(equal) {
            return browser.bar(equal);
        })
});

/**
 * COMMENTS
 */

it('should not lose comments around browser chaining calls', function() {
    // line1
    this.browser.foo().bar();
    // line2

    // line3
    this.browser.baz().qux();
    // line4
});

it('should not lose comments around browser chaining calls with then', function() {
    // line1
    this.browser.foo()
        .then(() => {
            // line2
            return this.browser.bar().baz();
            // line3
        })
        .qux();
    // line4
});

it('should not lose comments around browser chaining calls with variable declaration', function () {
    // line1
    const res = this.browser.foo()
        .then(() => {
            // line2
            return this.browser.bar().baz();
            // line3
        })
        .qux();
    // line4
});

it('should not lose comments around browser chaining calls with async-await', async function() {
    // line1
    await this.browser.foo().bar();
    // line2

    // line3
    await this.browser.baz().qux();
    // line4
});

it('should not lose comments around browser chaining calls with async-await and then', async function() {
    // line1
    await this.browser.foo()
        .then(() => {
            // line2
            return this.browser.bar().baz();
            // line3
        })
        .qux();
        // line4
});

it('should not lose comments around browser chaining calls with async-await and variable declaration', async function() {
    // line1
    const res = await this.browser.foo().bar();
    // line2
    await this.browser.baz()
});

it('should not lose comments around browser chaining calls with async-await, variable declaration and few sequential then', async function() {
    // line1
    const res = await this.browser.foo().bar();
    // line2
    await this.browser.baz()
        // line3
        .then(() => {
            // line4
            return this.browser.qux().ss();
            // line5
        })
        // line6
        .then(() => {
            // line7
            return this.browser.w().c();
            // line8
        })
    // line9
});
