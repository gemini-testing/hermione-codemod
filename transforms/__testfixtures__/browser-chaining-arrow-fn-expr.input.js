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
() => this.browser.foo().bar().baz();

// ANOTHER TESTS

// should use return statement when calling on command inside then
() => {
    return this.browser.foo()
        .then(dataset => this.browser.yaParseUrl(dataset[0].url));
};

// should correctly handle the case with assignment expression in "then" with arrow func
() => {
    let firstBreadcrumbText;

    return this.browser.foo()
        .then(text => firstBreadcrumbText = text);
};
