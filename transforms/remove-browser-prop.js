'use strict';

const RemoveBrowserPropTransformer = require('../lib/transformer/remove-browser-prop');

module.exports = (...args) => {
    const t = RemoveBrowserPropTransformer.create(...args);

    t.findBrowserUsageFns().forEach(data => t.removeBrowserProp(data));

    return t.toSource();
};
