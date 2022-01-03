'use strict';

module.exports = {
  name: require('./package').name,

  included(app) {
    this._super.included.apply(this, arguments);
    app.import('node_modules/uri-templates/uri-templates.js');
    app.import('vendor/shims/uri-templates.js');
  },
};
