'use strict';

const BrowserTransformer = require('../lib/browser-transformer');

module.exports = (...args) => {
    const t = BrowserTransformer.create(...args);

    t.findBrowserChainingFns().forEach((fn) => t.fromBrowserChainingToAsyncAwait(fn));

    return t.toSource();
};
