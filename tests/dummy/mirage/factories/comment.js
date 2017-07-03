import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  message() {
    return faker.lorem.sentence();
  },
});
