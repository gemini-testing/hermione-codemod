'use strict';

const BaseTransformer = require('./base');
const u = require('../utils');
const {PROPERTY_NAME_OPTION, DEFAULT_PROP_NAME} = require('../constants');

module.exports = class RemoveBrowserPropTransformer extends BaseTransformer {
    constructor(...args) {
        super(...args);

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
                    u.warn(
                        `find usage of "${this._propName}" identifier with other properties inside object pattern, fix it manually`,
                        node,
                        this._filePath
                    );
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

    warnAboutPropUsages() {
        const propUsages = [];

        this._root.find(this._j.MemberExpression, {property: {name: this._propName}})
            .forEach(({node}) => propUsages.push(node));

        this._root.find(this._j.ObjectPattern)
            .forEach(({node}) => {
                const hasProp = node.properties.some(({key}) => this._hasNeededProp(key));

                if (hasProp) {
                    propUsages.push(node);
                }
            });

        if (propUsages.length === 0) {
            return;
        }

        u.warn(
            `found ${propUsages.length} nodes with property "${this._propName}", maybe you should fix it manually`,
            propUsages,
            this._filePath
        );
    }

    _hasNeededProp(node) {
        return u.isIdentifier(node) && node.name === this._propName;
    }
};
