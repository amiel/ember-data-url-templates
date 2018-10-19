import Route from '@ember/routing/route';

export default Route.extend({
  model({ term }) {
    return this.store.query('post', { filter: { term } });
  },
});

