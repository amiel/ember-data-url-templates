import { Factory, faker, association } from 'ember-cli-mirage';

export default Factory.extend({
  author: association(),

  slug() {
    return faker.helpers.slugify(this.title);
  },
  title(i) {
    return `Post #${i}: ${faker.lorem.words()}`;
  },
});
