import Ember from 'ember';

/* global UriTemplate */

var isArray = Ember.isArray;
var sanitize = encodeURIComponent;

var isObject = function(object) { return typeof object === 'object'; };

export default Ember.Mixin.create({
  mergedProperties: ['urlSegments'],
  buildURL: function(type, id, snapshot, requestType, query) {
    var template = this.getTemplate(requestType);

    if (!template) {
      return this._super(...arguments);
    }

    template = this.compileTemplate(template);
    var templateResolver = this.templateResolverFor(type);
    var adapter = this;

    // HACK: Before emberjs/data@3b4b136d99b519c01008fd89aa3b6ba9a26a3374,
    // the query params were sent as the id parameter.
    // This can be removed once we have a version of ember-data to require.
    if (requestType === 'findQuery' && id && isObject(id)) { query = id; }

    return template.fill(function(name) {
      var result = templateResolver.get(name);

      if (Ember.typeOf(result) === 'function') {
        return result.call(adapter, type, id, snapshot, query);
      } else {
        return result;
      }
    });
  },

  getTemplate: function(requestType) {
    return this.get(requestType + 'UrlTemplate') || this.get('urlTemplate');
  },

  compileTemplate: function(template) {
    return new UriTemplate(template);
  },

  // TODO: Add ability to customize templateResolver
  templateResolverFor: function(/* type */) {
    return Ember.Object.create(this.get('urlSegments'));
  },

  urlSegments: {
    host: function () { return this.get('host'); },
    namespace: function() { return this.get('namespace'); },
    pathForType: function(type) { return this.pathForType(type); },

    id: function(type, id) {
      if (id && !isArray(id) && !isObject(id)) { return sanitize(id); }
    },

    query: function(type, id, snapshot, query) {
      return query;
    },

    unknownProperty: function(key) {
      return function(type, id, snapshot, query) {
        if (query && query[key]) { return query[key]; }
        if (snapshot) { return snapshot[key]; }
      };
    }
  }
});

