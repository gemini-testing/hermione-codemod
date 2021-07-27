'use strict';

const BaseTransformer = require('./base');
const u = require('../utils');
const {PROPERTY_NAME_OPTION, DEFAULT_PROP_NAME, REMOVE_BROWSER_PROP_MODE} = require('../constants');

module.exports = class RemoveBrowserPropTransformer extends BaseTransformer {
    constructor(...args) {
        super(...args, REMOVE_BROWSER_PROP_MODE);

        this._propName = this._options[PROPERTY_NAME_OPTION] || DEFAULT_PROP_NAME;
    }

    findBrowserUsageFns() {
        let browserUsageFns = [];

        this._eachBrowserExpr(({fn, browser}) => browserUsageFns.push({fn, browser}));

        return browserUsageFns;
    }

    removeBrowserProp(data) {
        this._removePropFromVarDecl(data);
        this._removePropFromCallExpr(data);
    }

    _removePropFromVarDecl({fn, browser}) {
        const varDecl = this._j(browser).closest(this._j.VariableDeclarator);

        if (varDecl.size() === 0) {
            return;
        }

        const varDeclNode = varDecl.get().node;
        const varDeclNodeId = varDeclNode.id;

        varDecl.find(this._j.ObjectPattern)
            .filter(({node}) => {
                if (node.properties.length === 1) {
                    const {key} = node.properties[0];
                    return this._hasNeededProp(key);
                }

                const hasProp = node.properties.some(({key}) => this._hasNeededProp(key));

                if (hasProp) {
                    this._warnings.addWarnToSourceCode({problemNode: node, parentNode: varDecl, propName: this._propName});
                }

                return false;
            })
            .replaceWith(({node}) => node.properties[0].value);

        this._j(fn)
            .find(this._j.MemberExpression, {object: {name: varDeclNodeId.name}, property: {name: this._propName}})
            .filter(p => this._j(p).closestScope().get().node === fn.node)
            .replaceWith(p => p.node.object);
    }

    _removePropFromCallExpr({browser}) {
        this._j(browser)
            .closest(this._j.MemberExpression, {property: {name: this._propName}})
            .replaceWith(p => p.node.object);
    }

    _hasNeededProp(node) {
        return u.isIdentifier(node) && node.name === this._propName;
    }
};
