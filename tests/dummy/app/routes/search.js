import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SearchRoute extends Route {
  @service store;

  model({ term }) {
    return this.store.query('post', { filter: { term } });
  }
}
