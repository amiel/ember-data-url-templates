import { isArray } from '@ember/array';
import { typeOf } from '@ember/utils';
import Mixin from '@ember/object/mixin';
import EmberObject from '@ember/object';
import UriTemplate from 'uri-templates';
import { assign } from '@ember/polyfills';
import { LINK_PREFIX } from "ember-data-url-templates/mixins/url-templates-serializer";
import flattenQueryParams from 'ember-data-url-templates/utils/flatten-query-params';

const ID_KEY_RE = /(_id|Id)$/;
const LINK_PREFIX_RE = new RegExp(`^${LINK_PREFIX}`);

export default Mixin.create({
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

  findBelongsTo(store, snapshot, link, relationship) {
    const url = this._urlFromLink(snapshot, link);
    return this._super(store, snapshot, url, relationship);
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
    return EmberObject.create(this.get('urlSegments'));
  },

  // HACK: Prevent query/queryRecord from appending query params to urls, we
  // can do that in the template.
  // TODO: ember-data plans to implement better hooks for customizing the
  // request. Hopefully in the future, this hack can be removed and another
  // hook used instead.
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
      var newQuery = assign({}, query);

      for (const param in newQuery) {
        if (newQuery[param] === undefined) { delete newQuery[param]; }
        if (newQuery[param] === null ) { newQuery[param] = ""; }
      }

      return flattenQueryParams(newQuery);
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
