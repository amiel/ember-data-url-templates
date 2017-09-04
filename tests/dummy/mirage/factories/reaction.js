import { Factory, faker } from 'ember-cli-mirage';
import Ember from 'ember';

const { String: { w } } = Ember;

export default Factory.extend({
  name() {
    return faker.name.findName();
  },

  verb() {
    faker.helpers.randomize(w(`
      Liked Hated Loved
    `));
  },
});
