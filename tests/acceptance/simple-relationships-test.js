import { get } from '@ember/object';
import { visit, findAll, find } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | simple relationships', async function(hooks) {
  setupApplicationTest(hooks);

  setupMirage(hooks);

  hooks.beforeEach(function () {
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
  });

  // The comments relationship comes with with data and ids. Therefore it uses
  // the findRecord adapter hook in the comment adapter and the comment adapter
  // urlTemplate.
  test('it can use a belongsTo id from the snapshot when generating a url', async function(assert) {
    await visit(`/posts/${get(this.post, 'slug')}`);
    assert.equal(findAll('#comments p').length, 1);
  });

  // The reactions relationshp is configured in the post model to use the
  // urlTemplate. It therefore uses the findMany hook in the post adapter and
  // the post adapter reactionsUrlTemplate.
  test('it can load a hasMany relationship from just a url template', async function(assert) {
    await visit(`/posts/${get(this.post, 'slug')}`);
    assert.equal(findAll('#reactions p').length, 4);
  });

  // The author relationshp is configured in the post model to use the
  // urlTemplate. It therefore uses the findBelongsTo hook in the post adapter
  // and the post adapter authorUrlTemplate.
  test('it can load a belongsTo relationship from just a url template', async function(assert) {
    await visit(`/posts/${get(this.post, 'slug')}`);
    assert.equal(find('#author').innerText, `by ${this.author.name}`);
  });

  // The relatedPosts relationship comes with links, and is a case to verify
  // that including urlTemplates does not cause a regression in the default
  // functionality for links.
  test('it can load related posts through the normal links method', async function(assert) {
    await visit(`/posts/${get(this.post, 'slug')}`);
    assert.equal(findAll('#related-posts p').length, 2);
  });
});

