import Ember from 'ember';
import RSVP from 'rsvp';

const { get } = Ember;

export default Ember.Route.extend({
  model(params) {
    return this.store.queryRecord('post', { slug: params.slug });
  },

  afterModel(model) {
    // HACK: This prevents an issue introduced in Ember Data 2.14 (https://github.com/emberjs/data/issues/4942)
    // This can safely be removed when emberjs/data#4942 has been resolved.
    return RSVP.hash({
      author: get(model, 'author'),
      comments: get(model, 'comments'),
      reactions: get(model, 'reactions'),
      relatedPosts: get(model, 'relatedPosts'),
    });
  },
});
