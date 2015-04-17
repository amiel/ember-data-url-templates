import Ember from 'ember';
import UrlTemplatesMixin from '../../../mixins/url-templates';
import { module, test } from 'qunit';

module('UrlTemplatesMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var UrlTemplatesObject = Ember.Object.extend(UrlTemplatesMixin);
  var subject = UrlTemplatesObject.create();
  assert.ok(subject);
});
