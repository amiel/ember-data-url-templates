import Ember from 'ember';
import UrlTemplatesMixin from 'ember-data-url-templates/mixins/url-templates';
import { module, test } from 'qunit';

module('UrlTemplatesMixin');

var Adapter = Ember.Object.extend({
  pathForType(type) {
    var camelized = Ember.String.camelize(type);
    return Ember.String.pluralize(camelized);
  }
});

var BasicAdapter = Adapter.extend(UrlTemplatesMixin, {
  urlTemplate: '/posts{/id}'
});

var NestedAdapter = Adapter.extend(UrlTemplatesMixin, {
  urlTemplate: '/posts/{postId}/comments{/id}'
});

var GenericAdapter = Adapter.extend(UrlTemplatesMixin, {
  urlTemplate: '{+host}{/namespace}/{pathForType}{/id}{?query*}'
});

var OriginalAdapter = Adapter.extend({
  buildURL() {
    return 'posts-finder';
  }
});

var FallbackAdapter = OriginalAdapter.extend(UrlTemplatesMixin);

test('it uses the template', function(assert) {
  var subject = BasicAdapter.create();
  var url = subject.buildURL();
  assert.equal(url, '/posts');
});

test('it fills in the id', function(assert) {
  var subject = BasicAdapter.create();
  var url = subject.buildURL('post', 3);
  assert.equal(url, '/posts/3');
});

test('it escapes basic values', function(assert) {
  var subject = BasicAdapter.create({ urlTemplate: '/{foo}' });
  var url = subject.buildURL('post', null, { foo: 'bar baz' });
  assert.equal(url, '/bar%20baz');
});

test('it can use values from the snapshot', function(assert) {
  var subject = NestedAdapter.create();
  var url = subject.buildURL('comment', 5, { postId: 3 });
  assert.equal(url, '/posts/3/comments/5');
});

test('it includes the namespace from the adapter', function(assert) {
  var subject = GenericAdapter.create({ namespace: 'api' });
  var url = subject.buildURL('post');
  assert.equal(url, '/api/posts');
});

test('it includes the unescaped host from the adapter', function(assert) {
  var subject = GenericAdapter.create({
    host: 'http://example.com',
    namespace: 'api'
  });

  var url = subject.buildURL('post');
  assert.equal(url, 'http://example.com/api/posts');
});

test('DEPRECATED: it can include values from findQuery as {?query*}', function(assert) {
  var subject = GenericAdapter.create();
  var url = subject.buildURL('post', { category: 'Uncategorized', date: '2015-11-11' }, null, 'findQuery');
  assert.equal(url, '/posts?category=Uncategorized&date=2015-11-11');
});

test('it can fill real query params', function(assert) {
  var subject = BasicAdapter.create({ urlTemplate: '/posts{?date,category,tag}' });
  var url = subject.buildURL('post', null, { date: '2015-10-10', tag: 'tagged' });
  assert.equal(url, '/posts?date=2015-10-10&tag=tagged');
});

test('it can use real query params provided by the new query parameter', function(assert) {
  var subject = BasicAdapter.create({ urlTemplate: '/posts{?date,category,tag}' });
  var url = subject.buildURL('post', null, null, 'findQuery', { date: '2015-10-10', tag: 'tagged' });
  assert.equal(url, '/posts?date=2015-10-10&tag=tagged');
});

test('DEPRECATED: it can use real query params from findQuery', function(assert) {
  var subject = BasicAdapter.create({ urlTemplate: '/posts{?date,category,tag}' });
  // findQuery passes query params as the `id` argument.
  var url = subject.buildURL('post', { date: '2015-10-10', tag: 'tagged' }, null, 'findQuery');
  assert.equal(url, '/posts?date=2015-10-10&tag=tagged');
});

test('it can use a custom template for the request type', function(assert) {
  var subject = BasicAdapter.create({ createRecordUrlTemplate: '/users/{userId}/create_post' });
  var url = subject.buildURL('post', null, { userId: 1 }, 'createRecord');
  assert.equal(url, '/users/1/create_post');
});

test('it does not fail for missing values when there is no snapshot', function(assert) {
  var subject = NestedAdapter.create();
  var url = subject.buildURL('comment');
  assert.equal(url, '/posts//comments');
});

test('it falls back to original buildURL if no template is found for requestType', function(assert) {
  var subject = FallbackAdapter.create();
  var url = subject.buildURL();
  assert.equal(url, 'posts-finder');
});
