import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  comments: hasMany(),
  author: belongsTo(),
  relatedPosts: hasMany('post'),
});
