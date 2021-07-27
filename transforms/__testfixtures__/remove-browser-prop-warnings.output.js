// should add syntax errors to the code when used few properties inside object destructuring
(async function() {
    static Error("hermione-codemod_1: fix code below manually");
    const {value: data, bar: baz} = await browser.foo();
    static Error("hermione-codemod_1: fix code above manually");
    return [data, baz];
})();
