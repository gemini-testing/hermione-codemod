'use strict';

// should do nothing if "browser" identifier is not used
() => {
    foo();
};

// should do nothing if there are no chained calls of browser commands
() => {
    this.browser.foo();
    this.browser.bar();
};

// should split chained browser commands with await and return result of last command
async () => {
    await this.browser.foo();
    await this.browser.bar();
    return this.browser.baz();
};

// ANOTHER TESTS

// should use return statement when calling on command inside then
async () => {
    const dataset = await this.browser.foo();
    return this.browser.yaParseUrl(dataset[0].url);
};

// should correctly handle the case with assignment expression in "then" with arrow func
async () => {
    let firstBreadcrumbText;

    const text = await this.browser.foo();
    firstBreadcrumbText = text;
};
