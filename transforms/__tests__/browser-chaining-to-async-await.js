'use strict';

const {defineTest} = require('jscodeshift/dist/testUtils');

defineTest(
    __dirname,
    'browser-chaining-to-async-await',
    {'browser-name': 'browser,this'},
    'browser-chaining-fn-expr'
);
defineTest(
    __dirname,
    'browser-chaining-to-async-await',
    {'browser-name': 'browser,this'},
    'browser-chaining-fn-decl'
);
defineTest(
    __dirname,
    'browser-chaining-to-async-await',
    {'browser-name': 'browser,this'},
    'browser-chaining-arrow-fn-expr'
);
defineTest(
    __dirname,
    'browser-chaining-to-async-await',
    {'browser-name': 'browser,this'},
    'browser-chaining-runnables'
);
defineTest(
    __dirname,
    'browser-chaining-to-async-await',
    {'browser-name': 'browser,this'},
    'browser-chaining-with-this'
);
