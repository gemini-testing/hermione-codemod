// should add syntax errors to the code when identifier is used inside then
(async function() {
    await this.browser.foo();
    static Error("hermione-codemod_23: fix code below manually");
    bar;
    static Error("hermione-codemod_23: fix code above manually");
    static Error("hermione-codemod_24: fix code below manually");
    baz;
    static Error("hermione-codemod_24: fix code above manually");
})();

// should add syntax errors to the code when identifier is used inside then that followed by another then with parameter
(async function() {
    await this.browser.foo();
    static Error("hermione-codemod_22: fix code below manually");
    bar;
    static Error("hermione-codemod_22: fix code above manually");
    return res;
})();

// should add syntax errors to the code when function is called inside then
(async function() {
    await this.browser.foo();
    static Error("hermione-codemod_20: fix code below manually");
    bar();
    static Error("hermione-codemod_20: fix code above manually");
    static Error("hermione-codemod_21: fix code below manually");
    baz();
    static Error("hermione-codemod_21: fix code above manually");
})();

// should add syntax errors to the code when function is called inside then that followed by another then with parameter
(async function() {
    await this.browser.foo();
    static Error("hermione-codemod_19: fix code below manually");
    bar();
    static Error("hermione-codemod_19: fix code above manually");
    return res;
})();

// should wrap to syntax errors only function call inside then and do nothing with call on browser
(async function() {
    await this.browser.foo();
    static Error("hermione-codemod_18: fix code below manually");
    foo();
    static Error("hermione-codemod_18: fix code above manually");
})();

// should add syntax errors to the code when function is binded inside then
(async function() {
    await this.browser.foo();
    static Error("hermione-codemod_17: fix code below manually");
    foo.bind(this.browser);
    static Error("hermione-codemod_17: fix code above manually");
})();

// should add syntax errors to the code when if statement is used inside then that followed by another then with parameter
(async function() {
    await this.browser.foo();
    static Error("hermione-codemod_16: fix code below manually");
    if (bar) {
        return 1;
    }
    static Error("hermione-codemod_16: fix code above manually");
    const res = 2;
    return res;
})();

// should add syntax errors to the code when if statement is used with else inside then that followed by another then with parameter
(async function() {
    await this.browser.foo();
    static Error("hermione-codemod_15: fix code below manually");
    if (bar) {
        return 1;
    } else {
        return 2;
    }
    static Error("hermione-codemod_15: fix code above manually");
    return res;
})();

// should add syntax errors to the code when if statement is used with else if inside then that followed by another then with parameter
(async function() {
    await this.browser.foo();
    static Error("hermione-codemod_14: fix code below manually");
    if (bar) {
        return 1;
    } else if (baz) {
        return 2;
    }
    static Error("hermione-codemod_14: fix code above manually");
    const res = 3;
    return res;
})();

// should add syntax errors to the code when few if statements are used inside then that followed by another then with parameter
(async function() {
    await this.browser.foo();
    static Error("hermione-codemod_12: fix code below manually");
    if (bar) {
        return 1;
    }
    static Error("hermione-codemod_12: fix code above manually");
    static Error("hermione-codemod_13: fix code below manually");
    if (baz) {
        return 2;
    }
    static Error("hermione-codemod_13: fix code above manually");
    const res = 3;
    return res;
})();

// should add syntax errors to the code when few nested if statements are used inside then that followed by another then with parameter
(async function() {
    await this.browser.foo();
    static Error("hermione-codemod_10: fix code below manually");
    if (bar) {
        static Error("hermione-codemod_11: fix code below manually");
        if (baz) {
            return 2;
        }
        static Error("hermione-codemod_11: fix code above manually");
        return 1;
    }
    static Error("hermione-codemod_10: fix code above manually");
    const res = 3;
    return res;
})();

// should add syntax errors to the code when onRejected callback is passed to then
(async function() {
    await this.browser.foo();
    return this.browser.bar();
    static Error("hermione-codemod_9: fix code below manually");
    throw new Error('o.O');
    static Error("hermione-codemod_9: fix code above manually");
})();

// should add syntax errors to the code when catch is used in browser chaining
(async function() {
    await this.browser.foo();
    static Error("hermione-codemod_8: fix code below manually");
    throw new Error('o.O');
    static Error("hermione-codemod_8: fix code above manually");
})();

// should add syntax errors to the code when finally is used in browser chaining
(async function() {
    await this.browser.foo();
    static Error("hermione-codemod_7: fix code below manually");
    return this.browser.bar();
    static Error("hermione-codemod_7: fix code above manually");
})();

// should add syntax errors to the code when used conditional expression
(function() {
    static Error("hermione-codemod_6: fix code below manually");
    platform === 'desktop' ? this.browser.foo() : this.browser.bar();
    static Error("hermione-codemod_6: fix code above manually");
    baz();
})();

// should add syntax errors to the code when used conditional expression with return statement
(function() {
    static Error("hermione-codemod_5: fix code below manually");
    return (platform === 'desktop' ? this.browser.foo() : this.browser.bar())
        .baz();
    static Error("hermione-codemod_5: fix code above manually");
})();

// should add syntax errors to the code when used logical expression with await expression
(async function() {
    static Error("hermione-codemod_4: fix code below manually");
    await (this.browser.foo() || this.browser.bar())
        .baz();
    static Error("hermione-codemod_4: fix code above manually");
})();

// should add syntax errors to the code when logical expression is used inside arrow function expression
async () => {
    await this.browser.foo();
    static Error("hermione-codemod_3: fix code below manually");
    true && this.browser.bar();
    static Error("hermione-codemod_3: fix code above manually");
};

// should add syntax errors to the code when asserts are used inside browser chaining
async () => {
    await this.browser.foo();
    static Error("hermione-codemod_1: fix code below manually");
    should.eventually.equal('foo');
    static Error("hermione-codemod_1: fix code above manually");
    await this.browser.bar();
    static Error("hermione-codemod_2: fix code below manually");
    should.be.rejectedWith('error');
    static Error("hermione-codemod_2: fix code above manually");
};

// should not add syntax error to the code when asserts are used not inside browser chaining
async () => {
    await this.browser.foo();
    const value = await this.browser.bar();
    value[0].should.equal(true);
    value[1].should.equal(false);
};
