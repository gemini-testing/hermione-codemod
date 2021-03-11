'use strict';

/**
 * FUNCTION EXPRESSION
 */

// should not remove "value" property from variable that are not the result of browser command
(function() {
    const result = {value: 'foo'};
    return result.value;
})();

// should not remove properties from result of browser command that not matched to "value"
(async function() {
    const result = await browser.foo();
    return result.bar;
})();

// should remove "value" property from result of browser command
(async function() {
    const result = await browser.foo();
    return result.value;
})();

// should remove all occurences of "value" property from result of browser command
(async function() {
    const result = await browser.foo();
    console.log(result.value);
    return result.value;
})();

// should remove only "value" property and do nothing with going further
(async function() {
    const result = await browser.foo();
    return result.value.bar;
})();

// should remove "value" property only inside current function and do nothing with others
(async function() {
    const result = await browser.foo(function() {
        const result = {value: 'bar'};
        return result.value;
    });
    return result.value;
})();

// should remove object destructuring with "value" property from result of browser command
(async function() {
    const {value} = await browser.foo();
    return value;
})();

// should remove object destructuring with "value" property and use variable passed to right from result of browser command
(async function() {
    const {value: data} = await browser.foo();
    return data;
})();

// should not fail when used few properties inside object destructuring, should be fixed manually (TODO: fix it)
(async function() {
    const {value: data, bar: baz} = await browser.foo();
    return [data, baz];
})();

// should remove object destructuring with "value" property inside array destructuring
(async function() {
    const [{value: data}, res] = await Promise.all(browser.foo(), browser.bar());
    return data + res;
})();

/**
* FUNCTION DECLARATION
*/

// should not remove "value" property from variable that are not the result of browser command
function some_1() {
    const result = {value: 'foo'};
    return result.value;
}

// should not remove properties from result of browser command that not matched to "value"
async function some_2() {
    const result = await browser.foo();
    return result.bar;
}

// should remove "value" property from result of browser command
async function some_3() {
    const result = await browser.foo();
    return result.value;
}

// should remove all occurences of "value" property from result of browser command
async function some_4() {
    const result = await browser.foo();
    console.log(result.value);
    return result.value;
}

// should remove only "value" property and do nothing with going further
async function some_5() {
    const result = await browser.foo();
    return result.value.bar;
}

// should remove "value" property only inside current function and do nothing with others
async function some_6() {
    const result = await browser.foo(function () {
        const result = {value: 'bar'};
        return result.value;
    });
    return result.value;
}

// should remove object destructuring with "value" property from result of browser command
async function some_7() {
    const {value} = await browser.foo();
    return value;
}

// should remove object destructuring with "value" property and use variable passed to right from result of browser command
async function some_8() {
    const {value: data} = await browser.foo();
    return data;
}

// should not fail when used few properties inside object destructuring, should be fixed manually (TODO: fix it)
async function some_9() {
    const {value: data, bar: baz} = await browser.foo();
    return [data, baz];
}

// should remove object destructuring with "value" property inside array destructuring
async function some_10() {
    const [{value: data}, res] = await Promise.all(browser.foo(), browser.bar());
    return data + res;
}

/**
 * ARROW FUNCTION
 */

// should not remove "value" property from variable that are not the result of browser command
() => {
    const result = {value: 'foo'};
    return result.value;
}

// should not remove properties from result of browser command that not matched to "value"
async () => {
    const result = await browser.foo();
    return result.bar;
}

// should remove "value" property from result of browser command
async () => {
    const result = await browser.foo();
    return result.value;
}

// should remove all occurences of "value" property from result of browser command
async () => {
    const result = await browser.foo();
    console.log(result.value);
    return result.value;
}

// should remove only "value" property and do nothing with going further
async () => {
    const result = await browser.foo();
    return result.value.bar;
}

// should remove "value" property only inside current function and do nothing with others
async () => {
    const result = await browser.foo(function () {
        const result = {value: 'bar'};
        return result.value;
    });
    return result.value;
}

// should remove object destructuring with "value" property from result of browser command
async () => {
    const {value} = await browser.foo();
    return value;
}

// should remove object destructuring with "value" property and use variable passed to right from result of browser command
async () => {
    const {value: data} = await browser.foo();
    return data;
}

// should not fail when used few properties inside object destructuring, should be fixed manually (TODO: fix it)
async () => {
    const {value: data, bar: baz} = await browser.foo();
    return [data, baz];
}

// should remove object destructuring with "value" property inside array destructuring
async () => {
    const [{value: data}, res] = await Promise.all(browser.foo(), browser.bar());
    return data + res;
}
