'use strict';

const {defineTest} = require('jscodeshift/dist/testUtils');

defineTest(
    __dirname,
    'browser-chaining-to-async-await',
    {'browser-names': 'browser'},
    'browser-chaining-fn-expr'
);
defineTest(
    __dirname,
    'browser-chaining-to-async-await',
    {'browser-names': 'browser'},
    'browser-chaining-fn-decl'
);
defineTest(
    __dirname,
    'browser-chaining-to-async-await',
    {'browser-names': 'browser'},
    'browser-chaining-arrow-fn-expr'
);
defineTest(
    __dirname,
    'browser-chaining-to-async-await',
    {'browser-names': 'browser'},
    'browser-chaining-runnables'
);
