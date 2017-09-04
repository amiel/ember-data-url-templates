import Ember from 'ember';
import UriTemplate from 'uri-templates';
import { LINK_PREFIX } from "ember-data-url-templates/mixins/url-templates-serializer";

const { isArray, copy, typeOf } = Ember;

const ID_KEY_RE = /(_id|Id)$/;
const LINK_PREFIX_RE = new RegExp(`^${LINK_PREFIX}`);

export default Ember.Mixin.create({
  mergedProperties: ['urlSegments'],
  buildURL(type, id, snapshot, requestType, query) {
    const templateString = this.getTemplate(requestType);

    if (!templateString) {
      return this._super(...arguments);
    }

    const template = this.compileTemplate(templateString);
    const templateResolver = this.templateResolverFor(type);
    const adapter = this;

    return template.fill((name) => {
      const result = templateResolver.get(name);

      if (typeOf(result) === 'function') {
        return result.call(adapter, type, id, snapshot, query);
      } else {
        return result;
      }
    });
  },

  findHasMany(store, snapshot, link, relationship) {
    const url = this._urlFromLink(snapshot, link);
    return this._super(store, snapshot, url, relationship);
  },

  findBelongsTo(store, snapshot, link) {
    const url = this._urlFromLink(snapshot, link);
    return this._super(store, snapshot, url);
  },

  getTemplate(requestType) {
    return this.get(requestType + 'UrlTemplate') || this.get('urlTemplate');
  },

  compileTemplate(template) {
    return new UriTemplate(template);
  },

  // TODO: Add ability to customize templateResolver
  // TODO: Add reference to the adapter
  templateResolverFor(/* type */) {
    return Ember.Object.create(this.get('urlSegments'));
  },

  // HACK: Prevent query/queryRecord from appending query params to urls, we
  // can do that in the template.
  // TODO: Use dataForRequest when ds-improved-ajax lands
  // (https://github.com/emberjs/data/pull/3099)
  sortQueryParams(/* params */) {
    return {};
  },

  _urlFromLink(snapshot, urlTemplate) {
    if (LINK_PREFIX_RE.test(urlTemplate)) {
      return this.buildURL(null, snapshot.id, snapshot, urlTemplate.replace(LINK_PREFIX_RE, ''), {});
    } else {
      return urlTemplate;
    }
  },

  urlSegments: {
    host() { return this.get('host'); },
    namespace() { return this.get('namespace'); },
    pathForType(type) { return this.pathForType(type); },

    id(type, id) {
      if (id && !isArray(id) && !isObject(id)) { return id; }
    },

    query(type, id, snapshot, query) {
      var newQuery = copy(query);

      for (const param in newQuery) {
        if (newQuery[param] === undefined) { delete newQuery[param]; }
        if (newQuery[param] === null ) { newQuery[param] = ""; }
      }

      return newQuery;
    },

    // TODO: Support automatic relationship ids through snapshots api.
    unknownProperty(key) {
      return (type, id, snapshot, query) => {
        if (query && query[key]) { return query[key]; }
        if (snapshot) {
          if (snapshot[key]) {
            return snapshot[key];
          } else if (isIdKey(key) && snapshot.belongsTo) {
            return snapshot.belongsTo(relationshipNameForKey(key), { id: true });
          } else if (snapshot.attr) {
            return snapshot.attr(key);
          }
        }
      };
    }
  }
});

function isObject(object) {
  return typeof object === 'object';
}

function relationshipNameForKey(key) {
  return key.replace(ID_KEY_RE, '');
}

function isIdKey(key) {
  return ID_KEY_RE.test(key);
}
