import DS from 'ember-data';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  post: belongsTo(),
  verb: attr('string'),
});
