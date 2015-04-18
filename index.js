/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-data-url-templates',

 included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/uri-templates/uri-templates.min.js');
  }
};
