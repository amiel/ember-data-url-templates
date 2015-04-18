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


test('BasicAdapter - uses the template', function(assert) {
  var subject = BasicAdapter.create();
  var url = subject.buildURL();
  assert.equal(url, '/posts');
});

test('BasicAdapter - fills the id', function(assert) {
  var subject = BasicAdapter.create();
  var url = subject.buildURL('post', 3);
  assert.equal(url, '/posts/3');
});

test('NestedAdapter - uses snapshot values', function(assert) {
  var subject = NestedAdapter.create();
  var url = subject.buildURL('comment', 5, { postId: 3 });
  assert.equal(url, '/posts/3/comments/5');
});

test('GenericAdapter - pluralized the type', function(assert) {
  var subject = GenericAdapter.create();
  var url = subject.buildURL('post');
  assert.equal(url, '/posts');
});

test('GenericAdapter - includes the namespace from the adapter', function(assert) {
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
