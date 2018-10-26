import Route from '@ember/routing/route';

export default Route.extend({
  model({ slug }) {
    // Add a random extra query param to see if it ends up in the url
    return this.store.queryRecord('post', { slug, foo: 'bar' });
  }
});
