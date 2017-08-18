import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

const { get } = Ember;

moduleForAcceptance('Acceptance | simple relationships', {
  beforeEach() {
    this.author = server.create('author');

    this.post = server.create('post', {
      author: this.author,
    });

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
  // The comments relationship comes with with data and ids. Therefore it uses
  // the findRecord adapter hook in the comment adapter and the comment adapter
  // urlTemplate.
  assert.equal(find('#comments p').length, 1);
});

test('it can load a hasMany relationship from just a url template', function(assert) {
  // The reactions relationshp is configured in the post model to use the
  // urlTemplate. It therefore uses the findMany hook in the post adapter and
  // the post adapter reactionsUrlTemplate.
  assert.equal(find('#reactions p').length, 4);
});

test('it can load a belongsTo relationship from just a url template', function(assert) {
  // The reactions relationshp is configured in the post model to use the
  // urlTemplate. It therefore uses the findBelongsTo hook in the post adapter and
  // the post adapter authorUrlTemplate.
  assert.equal(find('#author').text(), `by ${this.author.name}`);
});

