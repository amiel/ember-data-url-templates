import Route from '@ember/routing/route';

export default Route.extend({
  model({ slug }) {
    return this.store.queryRecord('post', { slug });
  }
});
