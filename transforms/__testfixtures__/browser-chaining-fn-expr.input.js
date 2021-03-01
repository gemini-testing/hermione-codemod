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
(function() {
    this.browser.foo().bar().baz();
})();

// should split chained browser commands with await and use browser without this
(function() {
    const {browser} = this;

    browser.foo().bar().baz();
})();

// should split only chained browser commands and do nothing with calls without chaining
(function() {
    this.browser.foo().bar();

    this.browser.baz();
})();

// should correctly split chained browser commands wrapped in additional function
(function() {
    (function() {
        this.browser.foo().bar().baz();
    })();
})();

// should correctly split chained browser commands specified in few lines
(function() {
    this.browser
        .foo()
        .bar()
        .baz();
})();

// should correctly split only chained browser commands and save comments in right place
(function() {
    // before foo
    this.browser.foo().bar();

    // before baz
    return this.browser.baz();
})();

// should correctly split chained browser commands specified in few lines with comments
(function() {
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
})();

// should move return statement to the last call without await
(function() {
    return this.browser.foo().bar().baz();
})();

// should move variable declaration with "var" to the last call
(function() {
    var result1 = this.browser.foo().bar().baz();
})();

// should move variable declaration with "let" to the last call
(function() {
    let result2 = this.browser.foo().bar().baz();
})();

// should move variable declaration with "const" to the last call
(function() {
    const result3 = this.browser.foo().bar().baz();
})();

// should move variable declaration with destructuring to the last call
(function() {
    const {some} = this.browser.foo().bar().baz();
})();

// should handle the case when browser is used multiple times (with if statement)
(function() {
    const {browser} = this;

    if (someIfStatement) {
        return browser.foo().bar();
    }

    return this.browser.foz().qux();
})();

// should handle the case when callback is used inside browser commands
(function() {
    const {browser} = this;

    return browser.foo().bar(function() {
        return this.browser.baz().qux();
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
    await this.browser.foo().bar();
})();

// should do nothing with async-await calls but transform without
(async function() {
    await this.browser.foo();

    this.browser.foo().bar();
})();

// should correctly save comments with async-await and browser chained commands
(async function() {
    // before foo
    await this.browser.foo();

    // before bar
    return this.browser.bar()
        // before then
        .then(async function() {
            // before baz
            await this.browser.baz();

            // before qux
            return this.browser.qux();
        })
        // before boom
        .boom();
})();

/**
 * USING PROMISES
 */

// should remove then and await only first browser command
(function() {
    this.browser.foo()
        .then(function() {
            this.browser.bar();
        })
})();

// should remove then and return call of browser command from it
(function() {
    return this.browser.foo()
        .then(function() {
            return this.browser.bar();
        })
})();

// should remove then and split browser commands from it
(function() {
    return this.browser.foo()
        .then(function() {
            return this.browser.bar().baz();
        })
})();

// should remove then and correctly use comments
(function() {
    // before chaining
    return this
        // before use browser #1
        .browser
        // before call foo
        .foo()
        // before call then #1
        // before call then #2
        .then(function() {
            return this
                // before use browser #2
                .browser
                // before call bar
                .bar()
                // before call baz
                .baz();
        });
})();

// should correctly save comments before few then
(function() {
    return this.browser.foo()
        // before then #1
        .then(function() {
            // before call baz
            return this.browser.baz();
        })
        // before then #2
        .then(function() {
            // before call qux
            return this.browser.qux();
        })
})()

// should remove all then calls and return only the last browser call
(function() {
    return this.browser.foo()
        .then(function() {
            return this.browser.bar().baz();
        })
        .then(function() {
            return this.browser.qux().boom();
        });
})();

// should correctly handle the case with few nested then calls
(function() {
    return this.browser.foo()
        .then(function() {
            return this.browser.bar().baz().then(function() {
                return this.browser.qux();
            })
        })
})();

// should correctly handle the case with one parameter in then call
(async function() {
    this.browser.foo().then(function(val) {
        return this.browser.bar(val);
    });
})();

// should correctly handle the case with one parameter as object in then call
(async function() {
    this.browser.foo().then(function({val}) {
        return this.browser.bar(val);
    });
})();

// should correctly handle the case with few parameters in then call
(async function () {
    this.browser.foo().then(function(v1, v2) {
        return this.browser.bar(v1, v2);
    });
})();

// should correctly handle the case with few thens with parameters and browser chaining calls
(function() {
    return this.browser.foo()
        .then(function(a) {
            return this.browser
                .bar(a)
                .baz()
                .then(function(b) {
                    return this.browser.qux(b).qwe();
                });
        })
        .then(function(c, d) {
            return this.browser.rty(c, d);
        })
})();

// should correctly handle the case with bind inside then (bind not called)
(function() {
    this.browser
        .foo()
        .then(foo.bind(this.browser));
})();

// should not fail when onRejected callback is passed to then (TODO: fix it with transform to try catch)
(function() {
    this.browser
        .foo()
        .then(function() {
            return this.browser.bar();
        }, function() {
            throw new Error('o.O');
        });
})();

// should not fail when catch is used in browser chaining (TODO: fix it with transform to try catch)
(function() {
    this.browser
        .foo()
        .catch(function() {
            throw new Error('o.O');
        });
})();

// should not fail when finally is used in browser chaining (TODO: fix it with transform to try finally)
(function() {
    this.browser
        .foo()
        .finally(function() {
            return this.browser.bar();
        });
})();

// should not fail when used conditional expression is used browser commands (TODO: fix it)
(function() {
    return (platform === 'desktop' ? this.browser.bar() : this.browser.baz())
        .qux();
})();

// should not fail when function is called inside then
(function() {
    return this.browser
        .foo()
        .then(bar())
        .then(baz());
})();

// should replace return node to await inside "then" (not last in chaining) and "if" statement
(function() {
    return this.browser
        .foo()
        .then(() => {
            if (a) {
                return bar();
            } else {
                return baz();
            }
        })
        .then(() => {
            if (b) {
                return qux();
            }
        });
})();
