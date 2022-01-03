import Controller from '@ember/controller';
import { readOnly } from '@ember/object/computed';

export default class PostController extends Controller {
  @readOnly('model') post;

  publishPost(post) {
    post.set('isPublished', true);
    post.save();
  }
}
