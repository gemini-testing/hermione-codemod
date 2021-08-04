# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.6](https://github.com/gemini-testing/hermione-codemod/compare/v0.1.5...v0.1.6) (2021-08-04)


### Bug Fixes

* not add syntax errors when asserts are used not inside browser chaining ([6021736](https://github.com/gemini-testing/hermione-codemod/commit/602173604fa49568701b966d0a05e136937cd484))

### [0.1.5](https://github.com/gemini-testing/hermione-codemod/compare/v0.1.4...v0.1.5) (2021-07-30)


### Bug Fixes

* add syntax errors around using if statement inside then which is followed by another then with parameter ([d4cc1fe](https://github.com/gemini-testing/hermione-codemod/commit/d4cc1fe1b3c1b8a15fc1a033d6e2c83e6ca50c94))
* do not replace all return nodes to await inside "then" ([2572c41](https://github.com/gemini-testing/hermione-codemod/commit/2572c410315b571d51dbb4b4d605c0e9e3002938))

### [0.1.4](https://github.com/gemini-testing/hermione-codemod/compare/v0.1.3...v0.1.4) (2021-07-29)


### Features

* **browser-chaining:** add option "--break-chaining-on" ([5220a9f](https://github.com/gemini-testing/hermione-codemod/commit/5220a9f095ca8b7f49812a8f45c2445e7e6f03ff))


### Bug Fixes

* improved work with cli-options ([08116d1](https://github.com/gemini-testing/hermione-codemod/commit/08116d19cd9c266b7c3bd36aa5db1ab36c7b97c4))
* rename option "no-await" to "not-await" and change defaults ([4fa6f1d](https://github.com/gemini-testing/hermione-codemod/commit/4fa6f1d13cdeeeeffba51e5d9ea75c287198984a))

### [0.1.3](https://github.com/gemini-testing/hermione-codemod/compare/v0.1.2...v0.1.3) (2021-07-27)


### Features

* warnings are now added to source code as syntax errors ([6366864](https://github.com/gemini-testing/hermione-codemod/commit/63668649fd6aba33e295503226853fd9f3deeae9))

### [0.1.2](https://github.com/gemini-testing/hermione-codemod/compare/v0.1.1...v0.1.2) (2021-07-15)


### Bug Fixes

* add await node to only awaitable expressions ([0847b88](https://github.com/gemini-testing/hermione-codemod/commit/0847b88209b84aeb7170426ff582f1bbf7fcc39c))

### [0.1.1](https://github.com/gemini-testing/hermione-codemod/compare/v0.1.0...v0.1.1) (2021-07-07)


### Bug Fixes

* **browser-chaining:** do not replace return node without value to await ([a71eb9b](https://github.com/gemini-testing/hermione-codemod/commit/a71eb9b53a0feb09e261fc446bf4070d1e9e252d))

## [0.1.0](https://github.com/gemini-testing/hermione-codemod/compare/v0.0.3...v0.1.0) (2021-03-15)


### Features

* add "remove-browser-prop" codemod ([3e402e2](https://github.com/gemini-testing/hermione-codemod/commit/3e402e2cc655657ed6e8d24a245273b2376ccebb))

### [0.0.3](https://github.com/gemini-testing/hermione-codemod/compare/v0.0.2...v0.0.3) (2021-03-03)


### Bug Fixes

* warn about use identifier inside then ([457cae8](https://github.com/gemini-testing/hermione-codemod/commit/457cae874e020af823b8ad677bfb1e5a07fe3f09))

### [0.0.2](https://github.com/gemini-testing/hermione-codemod/compare/v0.0.1...v0.0.2) (2021-03-03)


### Bug Fixes

* ability to use "this" as browser ([6b22963](https://github.com/gemini-testing/hermione-codemod/commit/6b22963f8118bbb54609c042a1c5ca9fcb6206be))

### 0.0.1 (2021-03-01)


### Features

* main functionality ([bc9eefb](https://github.com/gemini-testing/hermione-codemod/commit/bc9eefba61df0e0e50f6af0da6b6ecc7c7c88a2f))
