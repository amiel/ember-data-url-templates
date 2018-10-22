import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  // Documentation
  this.route('docs', function() {
    this.route('quickstart');
    this.route('patterns');
    this.route('cookbook', function() {
      this.route('queries');
      this.route('relationships');
    });
  });

  // Tests
  this.route('posts');
  this.route('search', { path: '/search/:term' });
  this.route('post', { path: '/posts/:slug' });
});

export default Router;
