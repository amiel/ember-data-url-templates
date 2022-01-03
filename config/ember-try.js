'use strict';
const getChannelURL = require('ember-source-channel-url');

module.exports = function() {
  return Promise.all([
    getChannelURL('release'),
    getChannelURL('beta'),
    getChannelURL('canary')
  ]).then((urls) => {
    return {
      useYarn: true,

      scenarios: [
        {
          name: 'ember-lts-3.4',
          env: {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({
              'jquery-integration': true,
            }),
          },
          npm: {
            devDependencies: {
              '@ember/jquery': '^1.1.0',
              'ember-source': '~3.4.0',
              'ember-data': '~3.4.0',
              'ember-ajax': '~4.0.1',
              'ember-decorators-polyfill': '~1.1.5',
              'ember-angle-bracket-invocation-polyfill': '~3.0.0',
            }
          }
        },
        {
          name: 'ember-lts-3.8',
          env: {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({
              'jquery-integration': true,
            }),
          },
          npm: {
            devDependencies: {
              '@ember/jquery': '^1.1.0',
              'ember-source': '~3.8.0',
              'ember-data': '~3.8.0',
              'ember-ajax': '~4.0.1',
              'ember-decorators-polyfill': '~1.1.5',
              'ember-angle-bracket-invocation-polyfill': '~3.0.0',
            }
          }
        },
        {
          name: 'ember-lts-3.12',
          npm: {
            devDependencies: {
              'ember-source': '~3.12.0',
              'ember-data': '~3.12.0',
            }
          }
        },
        {
          name: 'ember-lts-3.16',
          npm: {
            devDependencies: {
              'ember-source': '~3.16.0',
              'ember-data': '~3.16.0',
            }
          }
        },
        {
          name: 'ember-release',
          npm: {
            devDependencies: {
              'ember-source': urls[0]
            }
          }
        },
        {
          name: 'ember-beta',
          npm: {
            devDependencies: {
              'ember-source': urls[1]
            }
          }
        },
        {
          name: 'ember-canary',
          npm: {
            devDependencies: {
              'ember-source': urls[2]
            }
          }
        },
        {
          name: 'ember-default',
          npm: {
            devDependencies: {}
          }
        }
      ]
    };
  });
};
