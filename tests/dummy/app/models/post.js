import DS from 'ember-data';

const { attr, hasMany, belongsTo } = DS;

export default DS.Model.extend({
  slug: attr('string'),
  title: attr('string'),
  isPublished: attr('boolean'),

  author: belongsTo('author', { urlTemplate: 'author' }),
  comments: hasMany(),
  reactions: hasMany('reactions', { urlTemplate: 'reactions' }),
  relatedPosts: hasMany('posts'),
});
