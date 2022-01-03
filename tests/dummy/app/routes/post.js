import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PostRoute extends Route {
  @service store;

  model({ slug }) {
    // Add a random extra query param to see if it ends up in the url
    return this.store.queryRecord('post', { slug, foo: 'bar' });
  }
}
