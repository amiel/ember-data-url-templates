import { get } from '@ember/object';
import { visit, click, findAll } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | using attributes', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.post = server.create('post');
  });

  test('it can use an attribute from the snapshot when generating a url', async function(assert) {
    await visit(`/posts/${get(this.post, 'slug')}`);
    await click('#publish-post');

    await visit(`/posts/${get(this.post, 'slug')}`);
    assert.equal(findAll('#publish-post').length, 0);
  });
});
