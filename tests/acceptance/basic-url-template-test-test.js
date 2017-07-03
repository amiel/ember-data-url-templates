import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | basic url template test');

test('it can use a simple custom url', function(assert) {
  server.createList('post', 5);

  visit('/posts');

  andThen(() => {
    assert.equal(find('#posts .post').length, '5');
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

test('it can use an attribute from the snapshot when generating a url', function(assert) {
  server.create('post', {
    slug: 'my-first-post',
    title: 'This is my first post',
  });

  visit('/posts/my-first-post');

  click('#publish-post');

  visit('/posts/my-first-post');

  andThen(() => {
    assert.equal(find('#publish-post').length, 0);
  });
});

