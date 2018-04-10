import flattenQueryParams from 'dummy/utils/flatten-query-params';
import { module, test } from 'qunit';

module('Unit | Utility | flatten query params');

test('does not alter a simple object', function(assert) {
  const object = { foo: 'bar' };
  const result = flattenQueryParams(object);
  assert.deepEqual(object, result);
});

test('can flatten a simple nested query', function(assert) {
  const object = { filter: { foo: 'bar' } };
  const result = flattenQueryParams(object);
  assert.deepEqual(result, { 'filter[foo]': 'bar' });
});
