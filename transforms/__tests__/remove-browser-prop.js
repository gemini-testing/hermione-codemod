'use strict';

const {defineTest} = require('jscodeshift/dist/testUtils');

defineTest(
    __dirname,
    'remove-browser-prop',
    {'browser-name': 'browser,this', 'property-name': 'value'},
    'remove-browser-prop-from-var-decl'
);
defineTest(
    __dirname,
    'remove-browser-prop',
    {'browser-name': 'browser,this', 'property-name': 'value'},
    'remove-browser-prop-from-call-expr'
);
defineTest(
    __dirname,
    'remove-browser-prop',
    {'browser-name': 'browser,this', 'property-name': 'value'},
    'remove-browser-prop-warnings'
);
