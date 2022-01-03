import { module, test } from 'qunit';
import { visit, findAll, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | basic url template', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it can use a simple custom url', async function(assert) {
    this.server.createList('post', 5);

    await visit('/posts');
    assert.equal(findAll('#posts .post').length, 5);
  });

  test('it can use a specific template for one type of call (queryRecord)', async function(assert) {
    server.create('post', {
      slug: 'my-first-post',
      title: 'This is my first post',
    });

    await visit('/posts/my-first-post');
    assert.equal(find('.post h2').innerText, 'This is my first post');
  });

  test('it can query with params', async function(assert) {
    server.create('post', {
      id: 1,
      slug: 'my-first-post',
      title: 'This is my first post',
    });

    server.create('post', {
      id: 2,
      slug: 'my-second-post',
      title: 'This is my second post',
    });

    server.create('post', {
      id: 3,
      slug: 'my-third-post',
      title: 'This is another post',
    });

    await visit('/search/my');

    assert.equal(findAll('#post-1').length, 1);
    assert.equal(findAll('#post-2').length, 1);
    assert.equal(findAll('#post-3').length, 0);
  });

  test('it prevents ember-data from adding query params', async function(assert) {
    server.create('post', {
      slug: 'my-first-post',
      title: 'This is my first post',
    });

    let queryParams, params;

    server.get('/my-posts/:slug', (schema, request) => {
      queryParams = request.queryParams;
      params = request.params;
      return schema.posts.findBy({ slug: request.params.slug });
    });

    await visit('/posts/my-first-post');

    assert.equal(params.slug, 'my-first-post');
    assert.ok(!queryParams.foo);
  });
});
