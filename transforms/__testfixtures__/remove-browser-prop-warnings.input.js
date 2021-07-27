// should add syntax errors to the code when used few properties inside object destructuring
(async function() {
    const {value: data, bar: baz} = await browser.foo();
    return [data, baz];
})();
