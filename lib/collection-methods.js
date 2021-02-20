'use strict';

const _ = require('lodash');

module.exports = {
    findAllClosest: function(types) {
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
    }
};
