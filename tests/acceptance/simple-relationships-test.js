import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

const { get } = Ember;

moduleForAcceptance('Acceptance | simple relationships', {
  beforeEach() {
    this.author = server.create('author');

    this.relatedPosts = server.createList('post', 2);

    this.post = server.create('post', {
      author: this.author,
      relatedPosts: this.relatedPosts,
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

// The comments relationship comes with with data and ids. Therefore it uses
// the findRecord adapter hook in the comment adapter and the comment adapter
// urlTemplate.
test('it can use a belongsTo id from the snapshot when generating a url', function(assert) {
  assert.equal(find('#comments p').length, 1);
});

// The reactions relationshp is configured in the post model to use the
// urlTemplate. It therefore uses the findMany hook in the post adapter and
// the post adapter reactionsUrlTemplate.
test('it can load a hasMany relationship from just a url template', function(assert) {
  assert.equal(find('#reactions p').length, 4);
});

// The author relationshp is configured in the post model to use the
// urlTemplate. It therefore uses the findBelongsTo hook in the post adapter
// and the post adapter authorUrlTemplate.
test('it can load a belongsTo relationship from just a url template', function(assert) {
  assert.equal(find('#author').text(), `by ${this.author.name}`);
});

// The relatedPosts relationship comes with links, and is a case to verify
// that including urlTemplates does not cause a regression in the default
// functionality for links.
test('it can load related posts through the normal links method', function(assert) {
  assert.equal(find('#related-posts p').length, 2);
});

