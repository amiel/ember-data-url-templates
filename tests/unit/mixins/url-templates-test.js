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

var SegmentAdapter = Adapter.extend(UrlTemplatesMixin, {
  urlTemplate: '/users/{userId}/posts{/category}',
  sessionId: 123,

  urlSegments: {
    // normally this would be a
    userId: function() { return this.get('sessionId'); },
    category: function(type, id, snapshot, query) {
      if (query && query.featured) { return 'featured'; }
    },
  },
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

test('it escapes the id', function(assert) {
  var subject = BasicAdapter.create();
  var url = subject.buildURL('post', 'abc xyz');
  assert.equal(url, '/posts/abc%20xyz');
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

test('it can fill real query params', function(assert) {
  var subject = BasicAdapter.create({ urlTemplate: '/posts{?date,category,tag}' });
  var url = subject.buildURL('post', null, { date: '2015-10-10', tag: 'tagged' });
  assert.equal(url, '/posts?date=2015-10-10&tag=tagged');
});

test('it can use real query params provided by the new query parameter', function(assert) {
  var subject = BasicAdapter.create({ urlTemplate: '/posts{?date,category,tag}' });
  var url = subject.buildURL('post', null, null, 'query', { date: '2015-10-10', tag: 'tagged' });
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

test('it uses urlSegments', function(assert) {
  var subject = SegmentAdapter.create();
  var url = subject.buildURL('post');
  assert.equal(url, '/users/123/posts');
});

test('it calls urlSegments with the query', function(assert) {
  var subject = SegmentAdapter.create();
  var url = subject.buildURL('post', null, null, 'find', { featured: true });
  assert.equal(url, '/users/123/posts/featured');
});

test('it falls back to original buildURL if no template is found for requestType', function(assert) {
  var subject = FallbackAdapter.create();
  var url = subject.buildURL();
  assert.equal(url, 'posts-finder');
});

test('it deletes undefined query parameter', function(assert) {
  var subject = BasicAdapter.create({ urlTemplate: '/posts{?query*}' });
  var url = subject.buildURL('post', null, null, 'query', { tag: undefined });
  assert.equal(url, '/posts');
});

test('it clears null query parameter', function(assert) {
  var subject = BasicAdapter.create({ urlTemplate: '/posts{?query*}' });
  var url = subject.buildURL('post', null, null, 'query', { tag: null });
  assert.equal(url, '/posts?tag=');
});

test('it does not mutate undefined query param', function(assert) {
  var subject = BasicAdapter.create({ urlTemplate: '/posts{?query*}' });
  var params = { tag: undefined };
  subject.buildURL('post', null, null, 'query', params);
  assert.ok('tag' in params);
});

test('it does not mutate null query param', function(assert) {
  var subject = BasicAdapter.create({ urlTemplate: '/posts{?query*}' });
  var params = { tag: null };
  subject.buildURL('post', null, null, 'query', params);
  assert.equal(params.tag, null);
});
