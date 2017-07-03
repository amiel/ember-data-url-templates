import Ember from 'ember';

const { computed } = Ember;

export default Ember.Controller.extend({
  post: computed.readOnly('model'),

  actions: {
    publishPost(post) {
      post.set('isPublished', true);
      post.save();
    },
  },
});
