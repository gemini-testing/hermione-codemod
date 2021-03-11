'use strict';

/**
 * FUNCTION EXPRESSION
 */

// should not remove "value" property from calling not a browser command
(function() {
    return foo().value;
})();

// should not remove "value" property from async calling not a browser command
(async function() {
    return (await foo()).value;
})();

// should do nothing with calling browser command without using "value" property
(function() {
    return browser.foo();
})();

// should remove "value" property from calling browser command
(async function() {
    return browser.foo();
})();

// should remove "value" property from calling async browser command
(async function() {
    const res = await browser.foo();
})();

/**
* FUNCTION DECLARATION
*/

// should not remove "value" property from calling not a browser command
function some_1() {
    return foo().value;
}

// should not remove "value" property from async calling not a browser command
async function some_2() {
    return (await foo()).value;
}

// should do nothing with calling browser command without using "value" property
async function some_3() {
    return browser.foo();
}

// should remove "value" property from calling browser command
function some_4() {
    return browser.foo();
}

// should remove "value" property from calling async browser command
async function some_5() {
    const res = await browser.foo();
}

/**
 * ARROW FUNCTION
 */

// should not remove "value" property from calling not a browser command
() => {
    return foo().value;
}

// should not remove "value" property from async calling not a browser command
async () => {
    return (await foo()).value;
}

// should do nothing with calling browser command without using "value" property
() => {
    return browser.foo();
}

// should remove "value" property from calling browser command
() => {
    return browser.foo();
}

// should remove "value" property from calling async browser command
async () => {
    const res = await browser.foo();
}
