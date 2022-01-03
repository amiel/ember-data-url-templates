import { w } from '@ember/string';
import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

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
