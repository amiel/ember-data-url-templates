import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | basic url template');

test('it can use a simple custom url', function(assert) {
  server.createList('post', 5);

  visit('/posts');

  andThen(() => {
    assert.equal(find('#posts .post').length, 5);
  });
});

test('it can use a specific template for one type of call (queryRecord)', function(assert) {
  server.create('post', {
    slug: 'my-first-post',
    title: 'This is my first post',
  });

  visit('/posts/my-first-post');

  andThen(() => {
    assert.equal(find('.post h2').text(), 'This is my first post');
  });
});


test('it can query with params', function(assert) {
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

  visit('/search/my');

  andThen(() => {
    assert.equal(find('#post-1').length, 1);
    assert.equal(find('#post-2').length, 1);
    assert.equal(find('#post-3').length, 0);
  });
});

