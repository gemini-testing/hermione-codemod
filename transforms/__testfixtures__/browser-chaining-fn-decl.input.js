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
function some_3() {
    this.browser.foo().bar().baz();
}

// should split chained browser commands with await and use browser without this
function some_4() {
    const {browser} = this;

    browser.foo().bar().baz();
}

// should split only chained browser commands and do nothing with calls without chaining
function some_5() {
    this.browser.foo().bar();

    this.browser.baz();
}

// should correctly split chained browser commands wrapped in additional function
function some_6() {
    function some_6_1() {
        this.browser.foo().bar().baz();
    }
}

// should correctly split chained browser commands specified in few lines
function some_7() {
    this.browser
        .foo()
        .bar()
        .baz();
}

// should correctly split only chained browser commands and save comments in right place
function some_8() {
    // before foo
    this.browser.foo().bar();

    // before baz
    return this.browser.baz();
}

// should correctly split chained browser commands specified in few lines with comments
function some_9() {
    // before chaining
    this
        // before use browser
        .browser
        // before call foo
        .foo()
        // before call bar
        .bar()
        // before call baz
        .baz();
}

// should move return statement to the last call without await
function some_10() {
    return this.browser.foo().bar().baz();
}

// should move variable declaration with "var" to the last call
function some_11() {
    var result1 = this.browser.foo().bar().baz();
}

// should move variable declaration with "let" to the last call
function some_12() {
    let result2 = this.browser.foo().bar().baz();
}

// should move variable declaration with "const" to the last call
function some_13() {
    const result3 = this.browser.foo().bar().baz();
}

// should move variable declaration with destructuring to the last call
function some_14() {
    const {some} = this.browser.foo().bar().baz();
}

// should handle the case when browser is used multiple times (with if statement)
function some_15() {
    const {browser} = this;

    if (someIfStatement) {
        return browser.foo().bar();
    }

    return this.browser.foz().qux();
}

// should handle the case when callback is used inside browser commands
function some_16() {
    const {browser} = this;

    return browser.foo().bar(function some_16_1() {
        return this.browser.baz().qux();
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
    await this.browser.foo().bar();
}

// should do nothing with async-await calls but transform without
async function some_19() {
    await this.browser.foo();

    this.browser.foo().bar();
}

// should correctly save comments with async-await and browser chained commands
async function some_20() {
    // before foo
    await this.browser.foo();

    // before bar
    return this.browser.bar()
        // before then
        .then(async function some_20_1() {
            // before baz
            await this.browser.baz();

            // before qux
            return this.browser.qux();
        })
        // before boom
        .boom();
}

/**
 * USING PROMISES
 */

// should remove then and await only first browser command
function some_21() {
    this.browser.foo()
        .then(function some_21_1() {
            this.browser.bar();
        });
}

// should remove then and return call of browser command from it
function some_22() {
    return this.browser.foo()
        .then(function some_22_1() {
            return this.browser.bar();
        });
}

// should remove then and split browser commands from it
function some_23() {
    return this.browser.foo()
        .then(function some_23_1() {
            return this.browser.bar().baz();
        })
}

// should remove then and correctly use comments
function some_24() {
    // before chaining
    return this
        // before use browser #1
        .browser
        // before call foo
        .foo()
        // before call then #1
        // before call then #2
        .then(function some_24_1() {
            return this
                // before use browser #2
                .browser
                // before call bar
                .bar()
                // before call baz
                .baz();
        });
}

// should correctly save comments before few then
function some_25() {
    return this.browser.foo()
        // before then #1
        .then(function some_25_1() {
            // before call baz
            return this.browser.baz();
        })
        // before then #2
        .then(function some_25_2() {
            // before call qux
            return this.browser.qux();
        })
}

// should remove all then calls and return only the last browser call
function some_26() {
    return this.browser.foo()
        .then(function some_26_1() {
            return this.browser.bar().baz();
        })
        .then(function some_26_2() {
            return this.browser.qux().boom();
        });
}

// should correctly handle the case with few nested then calls
function some_27() {
    return this.browser.foo()
        .then(function some_27_1() {
            return this.browser.bar().baz().then(function some_27_2() {
                return this.browser.qux();
            })
        })
}

// should correctly handle the case with one parameter in then call
async function some_28() {
    this.browser.foo().then(function some_28_1(val) {
        return this.browser.bar(val);
    });
}

// should correctly handle the case with one parameter as object in then call
async function some_29() {
    this.browser.foo().then(function some_29_1({val}) {
        return this.browser.bar(val);
    });
}

// should correctly handle the case with few parameters in then call
async function some_30() {
    this.browser.foo().then(function some_30_1(v1, v2) {
        return this.browser.bar(v1, v2);
    });
}

// should correctly handle the case with few thens with parameters and browser chaining calls
function some_31() {
    return this.browser.foo()
        .then(function some_31_1(a) {
            return this.browser
                .bar(a)
                .baz()
                .then(function some_31_2(b) {
                    return this.browser.qux(b).qwe();
                });
        })
        .then(function some_31_3(c, d) {
            return this.browser.rty(c, d);
        })
}

// should correctly handle the case with bind inside then (bind not called)
function some_32() {
    this.browser
        .foo()
        .then(foo.bind(this.browser));
}

// should not fail when onRejected callback is passed to then (TODO: fix it with transform to try catch)
function some_33() {
    this.browser
        .foo()
        .then(function some_33_1() {
            return this.browser.bar();
        }, function some_33_2() {
            throw new Error('o.O');
        });
}

// should not fail when catch is used in browser chaining (TODO: fix it with transform to try catch)
function some_34() {
    this.browser
        .foo()
        .catch(function some_34_1() {
            throw new Error('o.O');
        });
}

// should not fail when finally is used in browser chaining (TODO: fix it with transform to try finally)
function some_35() {
    this.browser
        .foo()
        .finally(function some_35_1() {
            return this.browser.bar();
        });
}
