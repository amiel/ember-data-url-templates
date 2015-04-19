import Ember from 'ember';
import UrlTemplatesMixin from 'ember-data-url-templates/mixins/url-templates';
import { module, test } from 'qunit';

module('UrlTemplatesMixin');

var BasicAdapter = Ember.Object.extend(UrlTemplatesMixin, {
  urlTemplate: '/posts{/id}'
});

var NestedAdapter = Ember.Object.extend(UrlTemplatesMixin, {
  urlTemplate: '/posts/{postId}/comments{/id}'
});

var GenericAdapter = Ember.Object.extend(UrlTemplatesMixin, {
  urlTemplate: '{+host}{/namespace}/{pathForType}{/id}'
});


test('BasicAdapter - it uses the template', function(assert) {
  var subject = BasicAdapter.create();
  var url = subject.buildURL();
  assert.equal(url, '/posts');
});

test('BasicAdapter - it fills in the id', function(assert) {
  var subject = BasicAdapter.create();
  var url = subject.buildURL('post', 3);
  assert.equal(url, '/posts/3');
});

test('BasicAdapter - it escapes basic values', function(assert) {
  var subject = BasicAdapter.create({ urlTemplate: '/{foo}' });
  var url = subject.buildURL('post', null, { foo: 'bar baz' });
  assert.equal(url, '/bar%20baz');
});

test('NestedAdapter - it uses snapshot values', function(assert) {
  var subject = NestedAdapter.create();
  var url = subject.buildURL('comment', 5, { postId: 3 });
  assert.equal(url, '/posts/3/comments/5');
});

test('GenericAdapter - it pluralizes the type', function(assert) {
  var subject = GenericAdapter.create();
  var url = subject.buildURL('post');
  assert.equal(url, '/posts');
});

test('GenericAdapter - it includes the namespace from the adapter', function(assert) {
  var subject = GenericAdapter.create({ namespace: 'api' });
  var url = subject.buildURL('post');
  assert.equal(url, '/api/posts');
});

test('GenericAdapter - includes the unescaped host from the adapter', function(assert) {
  var subject = GenericAdapter.create({
    host: 'http://example.com',
    namespace: 'api'
  });

  var url = subject.buildURL('post');
  assert.equal(url, 'http://example.com/api/posts');
});

test('BasicAdapter - it can use real query params', function(assert) {
  var subject = BasicAdapter.create({ urlTemplate: '/posts{?date,category,tag}' });
  var url = subject.buildURL('post', null, { date: '2015-10-10', tag: 'tagged' });
  assert.equal(url, '/posts?date=2015-10-10&tag=tagged');
});

test('BasicAdapter - it can use a custom template for the request type', function(assert) {
  var subject = BasicAdapter.create({ createRecordUrlTemplate: '/users/{userId}/create_post' });
  var url = subject.buildURL('post', null, { userId: 1 }, 'createRecord');
  assert.equal(url, '/users/1/create_post');
});
