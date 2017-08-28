import Ember from 'ember';

const { get } = Ember;

export const LINK_PREFIX = 'urlTemplate:';

export default Ember.Mixin.create({
  normalize(modelClass) {
    let result = this._super(...arguments);
    return _injectLinksForRelationships(modelClass, result);
  },
});

function _injectLinksForRelationships(modelClass, result) {
  get(modelClass, 'relationshipsByName').forEach((relationship, name) => {
    const urlTemplate = _templateName(relationship.options.urlTemplate, name);
    _injectLinkForRelationship(result, name, urlTemplate);
  });

  return result;
}

function _templateName(setting, name) {
  if (setting && typeof setting === 'boolean') {
    return name;
  } else {
    return setting;
  }
}


function _injectLinkForRelationship(result, name, urlTemplateOption) {
  if (urlTemplateOption) {
    result.data.relationships[name] = { links: { related: LINK_PREFIX + urlTemplateOption } };
  }
}
