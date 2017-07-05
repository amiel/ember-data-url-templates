import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

const { get } = Ember;

moduleForAcceptance('Acceptance | using attributes', {
  beforeEach() {
    this.post = server.create('post');
  },
});

test('it can use an attribute from the snapshot when generating a url', function(assert) {
  visit(`/posts/${get(this.post, 'slug')}`);
  click('#publish-post');
  visit(`/posts/${get(this.post, 'slug')}`);

  andThen(() => {
    assert.equal(find('#publish-post').length, 0);
  });
});
