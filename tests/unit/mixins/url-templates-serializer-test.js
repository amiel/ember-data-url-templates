import Ember from 'ember';
import UrlTemplatesSerializerMixin from 'ember-data-url-templates/mixins/url-templates-serializer';
import { module, test } from 'qunit';

const { get } = Ember;

const BaseSerializer = Ember.Object.extend({
  normalize(modelClass, hash) {
    return {
      data: {
        id: hash.id,
        type: 'thing',
        attributes: hash,
        relationships: {},
      },
    };
  },
});

const UrlTemplatesSerializerObject = BaseSerializer.extend(UrlTemplatesSerializerMixin);

module('Unit | Mixin | url templates serializer', {
  beforeEach() {
    this.subject = UrlTemplatesSerializerObject.create();

    const relationships = this.relationships = [
      ['reactions', { options: { urlTemplate: 'theReactions' } }],
      ['comments', { options: {} }],
      ['author', { options: { urlTemplate: true } }],
    ];

    this.modelClass = {
      type: 'post',
      relationshipsByName: {
        forEach(fn) {
          relationships.forEach((array) => {
            fn(array[1], array[0]);
          });
        },
      },
    };
  },
});

test('it adds the link for a relationship that is configured with urlTemplate', function(assert) {
  const result = this.subject.normalize(this.modelClass, { id: '1' });
  const reactionRelationship = get(result, 'data.relationships.reactions');

  assert.deepEqual(reactionRelationship, {
    links: { related: 'theReactions' },
  });
});

test('it does not add a link for a relationship that is not configured with urlTemplate', function(assert) {
  const result = this.subject.normalize(this.modelClass, { id: '1' });
  const commentsRelationship = get(result, 'data.relationships.comments');

  assert.ok(!commentsRelationship);
});

test('it adds a link with the name of the relationship when true', function(assert) {
  const result = this.subject.normalize(this.modelClass, { id: '1' });
  const authorRelationship = get(result, 'data.relationships.author');

  assert.deepEqual(authorRelationship, {
    links: { related: 'author' },
  });
});


