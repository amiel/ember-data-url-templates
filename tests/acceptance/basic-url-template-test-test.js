import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | basic url template test');

test('visiting /posts', function(assert) {
  server.createList('post', 5);

  visit('/posts');

  andThen(() => {
    assert.equal(find('#posts .post').length, '5');
  });
});
