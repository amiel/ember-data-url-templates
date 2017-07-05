/* eslint-env node */
'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    'ember-cli-mirage': {
      enabled: true, // always enable mirage, even in production
    },
  };
};
