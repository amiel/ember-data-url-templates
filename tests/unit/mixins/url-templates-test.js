import Ember from 'ember';
import UrlTemplatesMixin from 'ember-data-url-templates/mixins/url-templates';
import { module, test } from 'qunit';

const {
  String: { camelize },
} = Ember;

module('UrlTemplatesMixin');

const Adapter = Ember.Object.extend({
  pathForType(type) {
    return camelize(type) + 's';
  }
});

const BasicAdapter = Adapter.extend(UrlTemplatesMixin, {
  urlTemplate: '/posts{/id}'
});

const NestedAdapter = Adapter.extend(UrlTemplatesMixin, {
  urlTemplate: '/posts/{postId}/comments{/id}'
});

const GenericAdapter = Adapter.extend(UrlTemplatesMixin, {
  urlTemplate: '{+host}{/namespace}/{pathForType}{/id}{?query*}'
});

const SegmentAdapter = Adapter.extend(UrlTemplatesMixin, {
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

const OriginalAdapter = Adapter.extend({
  buildURL() {
    return 'posts-finder';
  }
});

const FallbackAdapter = OriginalAdapter.extend(UrlTemplatesMixin);

test('it uses the template', function(assert) {
  const subject = BasicAdapter.create();
  const url = subject.buildURL();
  assert.equal(url, '/posts');
});

test('it fills in the id', function(assert) {
  const subject = BasicAdapter.create();
  const url = subject.buildURL('post', 3);
  assert.equal(url, '/posts/3');
});

test('it escapes basic values', function(assert) {
  const subject = BasicAdapter.create({ urlTemplate: '/{foo}' });
  const url = subject.buildURL('post', null, { foo: 'bar baz' });
  assert.equal(url, '/bar%20baz');
});

test('it escapes the id', function(assert) {
  const subject = BasicAdapter.create();
  const url = subject.buildURL('post', 'abc xyz');
  assert.equal(url, '/posts/abc%20xyz');
});

test('it can use values from the snapshot', function(assert) {
  const subject = NestedAdapter.create();
  const url = subject.buildURL('comment', 5, { postId: 3 });
  assert.equal(url, '/posts/3/comments/5');
});

test('it includes the namespace from the adapter', function(assert) {
  const subject = GenericAdapter.create({ namespace: 'api' });
  const url = subject.buildURL('post');
  assert.equal(url, '/api/posts');
});

test('it includes the unescaped host from the adapter', function(assert) {
  const subject = GenericAdapter.create({
    host: 'http://example.com',
    namespace: 'api'
  });

  const url = subject.buildURL('post');
  assert.equal(url, 'http://example.com/api/posts');
});

test('it can fill real query params', function(assert) {
  const subject = BasicAdapter.create({ urlTemplate: '/posts{?date,category,tag}' });
  const url = subject.buildURL('post', null, { date: '2015-10-10', tag: 'tagged' });
  assert.equal(url, '/posts?date=2015-10-10&tag=tagged');
});

test('it can use real query params provided by the new query parameter', function(assert) {
  const subject = BasicAdapter.create({ urlTemplate: '/posts{?date,category,tag}' });
  const url = subject.buildURL('post', null, null, 'query', { date: '2015-10-10', tag: 'tagged' });
  assert.equal(url, '/posts?date=2015-10-10&tag=tagged');
});

test('it can use a custom template for the request type', function(assert) {
  const subject = BasicAdapter.create({ createRecordUrlTemplate: '/users/{userId}/create_post' });
  const url = subject.buildURL('post', null, { userId: 1 }, 'createRecord');
  assert.equal(url, '/users/1/create_post');
});

test('it does not fail for missing values when there is no snapshot', function(assert) {
  const subject = NestedAdapter.create();
  const url = subject.buildURL('comment');
  assert.equal(url, '/posts//comments');
});

test('it uses urlSegments', function(assert) {
  const subject = SegmentAdapter.create();
  const url = subject.buildURL('post');
  assert.equal(url, '/users/123/posts');
});

test('it calls urlSegments with the query', function(assert) {
  const subject = SegmentAdapter.create();
  const url = subject.buildURL('post', null, null, 'find', { featured: true });
  assert.equal(url, '/users/123/posts/featured');
});

test('it falls back to original buildURL if no template is found for requestType', function(assert) {
  const subject = FallbackAdapter.create();
  const url = subject.buildURL();
  assert.equal(url, 'posts-finder');
});

test('it deletes undefined query parameter', function(assert) {
  const subject = BasicAdapter.create({ urlTemplate: '/posts{?query*}' });
  const url = subject.buildURL('post', null, null, 'query', { tag: undefined });
  assert.equal(url, '/posts');
});

test('it clears null query parameter', function(assert) {
  const subject = BasicAdapter.create({ urlTemplate: '/posts{?query*}' });
  const url = subject.buildURL('post', null, null, 'query', { tag: null });
  assert.equal(url, '/posts?tag=');
});

test('it does not mutate undefined query param', function(assert) {
  const subject = BasicAdapter.create({ urlTemplate: '/posts{?query*}' });
  const params = { tag: undefined };
  subject.buildURL('post', null, null, 'query', params);
  assert.ok('tag' in params);
});

test('it does not mutate null query param', function(assert) {
  const subject = BasicAdapter.create({ urlTemplate: '/posts{?query*}' });
  const params = { tag: null };
  subject.buildURL('post', null, null, 'query', params);
  assert.equal(params.tag, null);
});

test('it parameterizes nested queryParams as would normally be expected', function(assert) {
  const subject = BasicAdapter.create({ urlTemplate: '/posts{?query*}' });
  const params = { filter: { term: 'my' } };
  const url = subject.buildURL('post', null, null, 'query', params);
  assert.equal(url, '/posts?filter[term]=my');
});
