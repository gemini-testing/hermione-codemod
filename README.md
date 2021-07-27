# hermione-codemod [![Build Status](https://travis-ci.com/gemini-testing/hermione-codemod.svg)](https://travis-ci.com/gemini-testing/hermione-codemod)

This repository contains a collection of codemod scripts to be used with [JSCodeshift](https://github.com/facebook/jscodeshift) that helps to update Hermione APIs.

## Setup & Run

```sh
npm install hermione-codemod --save-dev
npx jscodeshift -t <transform> <path> [...options]
```
* `transform` - name of transform script, see available transforms below;
* `path` - files or directories that should be transformed (can use glob);
* `options` - contains options that passed to the runner of [jscodeshift](https://github.com/facebook/jscodeshift) and to the transform script.

For example you can use the `-d` option for a dry-run and `-p` to print the output for comparison. The remaining jscodeshift options can be found [here](https://github.com/facebook/jscodeshift#usage-cli).

## Included Transforms

### browser-chaining-to-async-await

Transforms calls of browser commands from chaining to async-await style.
Used in order to update hermione with wdio@7+ inside in which chaining of browser commands does not work anymore and tests should be rewritten to async-await.
Moreover in wdio@7 result of calling browser commands does not return to `value` property anymore, to fix this use [remove-browser-prop](#remove-browser-prop) script.

```sh
npx jscodeshift -t hermione-codemod/transforms/browser-chaining-to-async-await.js <path> [...options]
```

For example (input):
```js
it('test', function() {
  return this.browser
    .foo()
    .bar()
    .then((res) => this.browser.baz(res))
    .qux();
});
```

will be transformed to (output):
```js
it('test', async function() {
  await this.browser.foo();
  const res = await this.browser.bar();
  await this.browser.baz(res);
  await this.browser.qux();
});
```

More examples can be found in [transforms/\_\_testfixtures\_\_](https://github.com/gemini-testing/hermione-codemod/blob/main/transforms/__testfixtures__) directory.

#### Options

* `--browser-name` - ability to set used name of browser instance variable in your tests. Transform script will find usage of passed browser names with chaining calls and transform them to await nodes. Default value is `browser`.

  Example:
  ```sh
  npx jscodeshift -t <transform> <path> --browser-name='bro1,bro2'
  ```

  Input:
  ```js
  const fn1 = () => bro1.foo().bar();
  const fn2 = () => this.bro2.baz().qux();
  ```

  Output:
  ```js
  const fn1 = async () => {
    await bro1.foo();
    return bro1.bar();
  };
  const fn2 = async () => {
    await this.bro2.baz();
    return this.bro2.qux();
  };
  ```

* `--not-await` - ability to set names of called nodes that should not be awaited. For example if you do not await assert calls called inside then callback. Default value is `['assert', 'should', 'expect']`.

  Example:
  ```sh
  npx jscodeshift -t <transform> <path> --not-await='assert,expect'
  ```

  Input:
  ```js
  (function() {
    return browser.foo()
      .then(() => assert.equal(1, 1))
      .then(() => expect(2).to.equal(2));
  })();
  ```

  Output:
  ```js
  (async function() {
    await browser.foo();
    assert.equal(1, 1);
    return expect(2).to.equal(2);
  })();
  ```

#### Areas of improvement

* Can't resolve problem with duplication of identifier declaration. Reproduced when parameters of resolve callback inside then have the same name. Currently it should be fixed manually. To simplify the search for such cases, you just need to run transform script again on the same path. Example:
  Input:
  ```js
  const fn = () => browser.foo()
    .then((a) => browser.bar(a))
    .then((a) => browser.baz(a));
  ```
  Output:
  ```js
  const fn = async () => {
    const a = await browser.foo();
    const a = await browser.bar(a); // Identifier 'a' has already been declared
    return browser.baz(a);
  };
  ```
* Can't correctly handle the case with call function instead declarate resolve callback in `then` expression. Currently it should be fixed manually. Example:
  Input:
  ```js
  const fn = () => browser.foo().then(bar.bind(browser));
  ```
  Output:
  ```js
  const fn = async () => {
    await browser.foo();
    return bar.bind(browser); // problem: bar function will not be called
  };
  ```
  In that case script will inform you about found problem, like this:
  ```
  WARN: found CallExpression inside then, maybe you should fix it manually
      file: /your-test.js
      position: {"start":2,"end":2}
  ```
* Can't correctly handle the case with usage reject callback in `then` expression. Currently it should be fixed manually. Example:
  Input:
  ```js
  const fn = () => browser.foo().then(() => a(), (err) => b(err));
  ```
  Output:
  ```js
  const fn = async () => {
    await browser.foo();
    return a();
  };
  ```
  In that case script will inform you about found problem, like this:
  ```
  WARN: can't transform onRejected callback inside "then", fix it manually
      file: /your-test.js
      position: {"start":2,"end":2}
  ```
* Can't correctly handle the case with usage `catch` expression in chaining of browser command calls. Currently it should be fixed manually. Example:
  Input:
  ```js
  const fn = () => browser.foo().catch((err) => handle(err));
  ```
  Output:
  ```js
  const fn = async () => {
    await browser.foo();
    return handle(err); // problem: "err" identifier is not declarated
  };
  ```
  In that case script will inform you about found problem, like this:
  ```
  WARN: can't correctly transform "catch", fix it manually
      file: /your-test.js
      position: {"start":2,"end":2}
  ```
* Can't correctly handle the case with usage `finally` expression in chaining of browser command calls. Currently it should be fixed manually. Example:
  Input:
  ```js
  const fn = () => browser.foo().finally(() => doSomething());
  ```
  Output:
  ```js
  const fn = async () => {
    await browser.foo();
    return doSomething(); // problem: should be rewritten with using try - finallly
  };
  ```
  In that case script will inform you about found problem, like this:
  ```
  WARN: can't correctly transform "finally", fix it manually
      file: /your-test.js
      position: {"start":2,"end":2}
  ```
* Can't correctly handle the case with usage logical expression with chaining of browser command calls. Currently it should be fixed manually. Example:
  Input:
  ```js
  const fn = () => true && browser.foo().bar();
  ```
  Output:
  ```js
  const fn = async () => true && browser.foo().bar(); // problem: should be rewritten using if statement and await browser commands
  ```
  In that case script will inform you about found problem, like this:
  ```
  WARN: can't correctly transform LogicalExpression, fix it manually
      file: /your-test.js
      position: {"start":2,"end":2}
  ```
* Can't correctly handle the case with usage conditional expression with chaining of browser command calls. Currently it should be fixed manually. Example:
  Input:
  ```js
  const fn = () => a ? browser.foo().bar() : b;
  ```
  Output:
  ```js
  const fn = async () => a ? browser.foo().bar() : b; // problem: should be rewritten using if-else statements and await browser commands
  ```
  In that case script will inform you about found problem, like this:
  ```
  WARN: can't correctly transform ConditionalExpression, fix it manually
      file: undefined
      position: {"start":2,"end":2}
  ```

#### Example of usage

1. Run transform script on files that should be modified. For example I want modify all files inside `tests/platform/**` whose name matches on `*.hermione.js` or `*.hermione-helper.js`:
```sh
npx jscodeshift -t node_modules/hermione-codemod/transforms/browser-chaining-to-async-await.js tests/platform/**/*.*(hermione|hermione-helper).js --not-await='assert'
```
2. After transformation of all tests script may inform you about found problems which are listed [above](#areas-of-improvement), fix them manually.
3. Run transform script again even if it does not inform you about any problems in previous step. It is necessary because it can found problems with duplication of identifier declaration after transformation code. Rerun transform script until it succeeds and won't inform you that no test has been modified.
4. Fix code style in trasformed tests:
```sh
npx eslint --fix tests/platform/**/*.*(hermione|hermione-helper).js
```

### remove-browser-prop

Removes usages of the passed property from the result of calling browser commands.
Used in order to update hermione with wdio@7+ inside in which property `value` not used anymore for store result of executing browser command.
Must be used only after `browser-chaining-to-async-await` script.

```sh
npx jscodeshift -t node_modules/hermione-codemod/transforms/remove-browser-prop.js <path> [...options]
```

For example (input):
```js
it('test', async function() {
  const res1 = await this.browser.foo();
  const {value: res2} = await this.browser.bar();
  const res3 = (await this.browser.baz()).value;

  return [res1.value, res2, res3]
});
```

will be transformed to (output):
```js
it('test', async function() {
  const res1 = await this.browser.foo();
  const res2 = await this.browser.bar();
  const res3 = await this.browser.baz();

  return [res1, res2, res3];
});
```

More examples can be found in [transforms/\_\_testfixtures\_\_](https://github.com/gemini-testing/hermione-codemod/blob/main/transforms/__testfixtures__) directory.

#### Options

* `--browser-name` - as like in `browser-chaining-to-async-await` script;
* `--property-name` - ability to set name of property which should be removed from the result of calling browser commands. Default value is `value`.

  Example:
  ```sh
  npx jscodeshift -t <transform> <path> --property-name='value'
  ```

## Recast Options

[Options to recast's printer](https://github.com/benjamn/recast/blob/master/lib/options.ts) can be provided through the `printOptions` command line argument.

```sh
npx jscodeshift -t <transform> <path> --printOptions='{"tabWidth":2}'
```
