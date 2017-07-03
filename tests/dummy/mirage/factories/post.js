import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  slug() {
    return faker.helpers.slugify(this.title);
  },
  title(i) {
    return `Post #${i}: ${faker.lorem.words()}`;
  },
});
