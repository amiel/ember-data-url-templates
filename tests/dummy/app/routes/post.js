import Ember from 'ember';
import RSVP from 'rsvp';

const { get } = Ember;

export default Ember.Route.extend({
  model(params) {
    return this.store.queryRecord('post', { slug: params.slug });
  },

  afterModel(model) {
    return RSVP.hash({
      author: get(model, 'author'),
      comments: get(model, 'comments'),
      reactions: get(model, 'reactions'),
    });
  },
});
