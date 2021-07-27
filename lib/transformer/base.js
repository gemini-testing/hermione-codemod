'use strict';

const _ = require('lodash');
const Warnings = require('../warnings');
const collectionMethods = require('../collection-methods');
const u = require('../utils');
const {FN_TYPES, DEFAULT_PRINT_OPTS, BROWSER_NAME_OPTION} = require('../constants');

module.exports = class BaseTransformer {
    static create(...args) {
        return new this(...args);
    }

    constructor(file, api, options, transformMode) {
        this._j = api.jscodeshift;
        this._root = this._j(file.source);
        this._filePath = file.path;
        this._options = options;
        this._transformMode = transformMode;

        this._warnings = Warnings.create(this._j, file.path, transformMode);
        this._registerCollectionMethods();
    }

    toSource() {
        this._warnings.showAll();

        return this._root.toSource(this._options.printOptions || DEFAULT_PRINT_OPTS);
    }

    _eachBrowserExpr(cb) {
        const fnPaths = _.flatMap(FN_TYPES, fnType => this._root.find(this._j[fnType]).paths());
        // last function should be handled first
        const sortedFnPaths = u.sortByFarthestPosition(fnPaths);
        const uniqBrowserExps = new Set();

        sortedFnPaths.forEach(fn => {
            const fnParentNode = _.get(fn, 'parent.node');
            const isRunnable = u.isRunnableFn(fnParentNode);
            const browserExps = this._findBrowserExpressions(fn);

            browserExps.forEach(browser => {
                if (uniqBrowserExps.has(browser) || u.isBrowserPassedAsArg(browser)) {
                    return;
                }

                uniqBrowserExps.add(browser);

                cb({fn, browser, isRunnable});
            });
        });
    }

    _findBrowserExpressions(fn) {
        return this._j(fn).find(this._j.MemberExpression, node => {
            return u.isBrowserExpr(node, this._options[BROWSER_NAME_OPTION]);
        });
    }

    _registerCollectionMethods() {
        Object.keys(collectionMethods).forEach(methodName => {
            if (this._root[methodName]) {
                return;
            }

            this._j.registerMethods({[methodName]: collectionMethods[methodName]});
        });
    }
};
