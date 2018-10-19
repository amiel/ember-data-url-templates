import { w } from '@ember/string';
import { Factory, faker } from 'ember-cli-mirage';

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
