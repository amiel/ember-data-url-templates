import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

const { get } = Ember;

moduleForAcceptance('Acceptance | simple relationships', {
  beforeEach() {
    this.post = server.create('post');

    this.comment = server.create('comment', {
      post: this.post,
    });

    server.createList('reaction', 4, {
      post: this.post,
    });

    visit(`/posts/${get(this.post, 'slug')}`);
  },
});

test('it can use a belongsTo id from the snapshot when generating a url', function(assert) {
  // Comments are loaded with data and ids
  assert.equal(find('#comments p').length, 1);
});

test('it can load a relationship from just a url template', function(assert) {
  assert.equal(find('#reactions p').length, 4);
});

