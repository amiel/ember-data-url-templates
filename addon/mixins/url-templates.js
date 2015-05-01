import Ember from 'ember';

/* global UriTemplate */

var isArray = Ember.isArray;
var sanitize = encodeURIComponent;

var isObject = function(object) { return typeof object === 'object'; };

export default Ember.Mixin.create({
  buildURL: function(type, id, snapshot, requestType) {
    var template = this.compileTemplate(this.getTemplate(requestType));
    var templateResolver = this.templateResolverFor(type);
    var adapter = this;

    return template.fill(function(name) {
      var result = templateResolver.get(name);

      if (Ember.typeOf(result) === 'function') {
        return result.call(adapter, type, id, snapshot);
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

    query: function(type, id) {
      if (isObject(id)) { return id; }
    },

    unknownProperty: function(key) {
      return function(type, id, snapshot) {
        // `id` is an object whet passed by `findQuery`
        if (id && isObject(id)) { return id[key]; }
        if (snapshot) { return snapshot[key]; }
      };
    }
  },

  pathForType: function(type) {
    var camelized = Ember.String.camelize(type);
    return Ember.String.pluralize(camelized);
  }
});

