import DS from 'ember-data';

const { attr, hasMany } = DS;

export default DS.Model.extend({
  slug: attr('string'),
  title: attr('string'),
  isPublished: attr('boolean'),
  comments: hasMany(),
});
