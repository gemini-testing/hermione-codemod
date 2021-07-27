// should add syntax errors to the code when identifier is used inside then
(function() {
    return this.browser
        .foo()
        .then(bar)
        .then(baz);
})();

// should add syntax errors to the code when function is called inside then
(function() {
    return this.browser
        .foo()
        .then(bar())
        .then(baz());
})();

// should wrap to syntax errors only function call inside then and do nothing with call on browser
(function() {
    this.browser
        .foo()
        .then(foo());
})();

// should add syntax errors to the code when function is binded inside then
(function() {
    this.browser
        .foo()
        .then(foo.bind(this.browser));
})();

// should add syntax errors to the code when onRejected callback is passed to then
(function() {
    this.browser
        .foo()
        .then(function() {
            return this.browser.bar();
        }, function() {
            throw new Error('o.O');
        });
})();

// should add syntax errors to the code when catch is used in browser chaining
(function() {
    this.browser
        .foo()
        .catch(function() {
            throw new Error('o.O');
        });
})();

// should add syntax errors to the code when finally is used in browser chaining
(function() {
    this.browser
        .foo()
        .finally(function() {
            return this.browser.bar();
        });
})();

// should add syntax errors to the code when used conditional expression
(function() {
    platform === 'desktop' ? this.browser.foo() : this.browser.bar();
    baz();
})();

// should add syntax errors to the code when used conditional expression with return statement
(function() {
    return (platform === 'desktop' ? this.browser.foo() : this.browser.bar())
        .baz();
})();

// should add syntax errors to the code when used logical expression with await expression
(async function() {
    await (this.browser.foo() || this.browser.bar())
        .baz();
})();

// should add syntax errors to the code when logical expression is used inside arrow function expression
() => {
    this.browser
        .foo()
        .then(() => true && this.browser.bar());
};