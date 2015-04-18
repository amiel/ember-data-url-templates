import Ember from 'ember';
var get = Ember.get;
var isArray = Ember.isArray;
var sanitize = encodeURIComponent;

export default Ember.Mixin.create({
  buildURL: function(type, id, snapshot /*, requestType */) {
    var template = _compileTemplate(this.get('urlTemplate'));
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

  // TODO: Add ability to customize templateResolver
  templateResolverFor: function(/* type */) {
    return Ember.Object.create(get(this, 'urlSegments'));
  },

  urlSegments: {
    host: function () { return this.get('host'); },
    namespace: function() { return this.get('namespace'); },
    pathForType: function(type) { return this.pathForType(type); },

    id: function(type, id) {
      if (id && !isArray(id)) { return sanitize(id); }
    },

    unknownProperty: function(key) {
      return function(type, id, snapshot) {
        return get(snapshot, key);
      };
    }
  },

  pathForType: function(type) {
    var camelized = Ember.String.camelize(type);
    return Ember.String.pluralize(camelized);
  }
});

// TODO: Use fully compliant rfc6570 library
var _compileTemplate = function(template) {
  return Ember.Object.create({
    template: template,
    fill: function(fn) {
      return this.get('template').replace(/\{([\/?+]?)(\w+)\}/g, function(_, prefix, name) {
        var result = fn(name);

        if (prefix === '?') { prefix = '?' + name + '='; }
        if (prefix === '+') { prefix = ''; }

        if (result) {
          return prefix + result;
        } else {
          return '';
        }
      });
    }
  });
};

