import Ember from 'ember';

/* global UriTemplate */

var isArray = Ember.isArray;

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
  // TODO: Add reference to the adapter
  templateResolverFor: function(/* type */) {
    return Ember.Object.create(this.get('urlSegments'));
  },

  // HACK: Prevent query/queryRecord from appending query params to urls, we
  // can do that in the template.
  // TODO: Use dataForRequest when ds-improved-ajax lands
  // (https://github.com/emberjs/data/pull/3099)
  sortQueryParams: function(/* params */) {
    return {};
  },

  urlSegments: {
    host: function () { return this.get('host'); },
    namespace: function() { return this.get('namespace'); },
    pathForType: function(type) { return this.pathForType(type); },

    id: function(type, id) {
      if (id && !isArray(id) && !isObject(id)) { return id; }
    },

    query: function(type, id, snapshot, query) {
      return query;
    },

    // TODO: Support automatic relationship ids through snapshots api.
    unknownProperty: function(key) {
      return function(type, id, snapshot, query) {
        if (query && query[key]) { return query[key]; }
        if (snapshot) { return snapshot[key]; }
      };
    }
  }
});
