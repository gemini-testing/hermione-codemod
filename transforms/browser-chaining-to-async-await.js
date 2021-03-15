'use strict';

const BrowserChainingTransformer = require('../lib/transformer/browser-chaining-to-async-await');

module.exports = (...args) => {
    const t = BrowserChainingTransformer.create(...args);

    t.findBrowserChainingFns().forEach((fn) => t.fromBrowserChainingToAsyncAwait(fn));

    return t.toSource();
};
