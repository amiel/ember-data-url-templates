import Ember from 'ember';

export default Ember.Route.extend({
  model({ term }) {
    return this.store.query('post', { filter: { term } });
  },
});

