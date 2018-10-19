import { readOnly } from '@ember/object/computed';
import Controller from '@ember/controller';

export default Controller.extend({
  post: readOnly('model'),

  actions: {
    publishPost(post) {
      post.set('isPublished', true);
      post.save();
    },
  },
});
