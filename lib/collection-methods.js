'use strict';

const _ = require('lodash');

module.exports = {
    closestAll: function(types) {
        types = _.isArray(types) ? types : [types];
        const nodePaths = [];

        return this.map((path) => {
            let {parent} = path;

            while (parent && types.some(t => t.check(parent.value))) {
                nodePaths.push(parent);
                parent = parent.parent;
            }

            return nodePaths;
        });
    },

    closestSome: function(types) {
        types = _.isArray(types) ? types : [types];

        return this.map((path) => {
            let {parent} = path;

            while (parent && !types.some(t => t.check(parent.value))) {
                parent = parent.parent;
            }

            return parent || null;
        });
    }
};
