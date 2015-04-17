import DS from "ember-data";
import UrlTemplates from "ember-data-url-templates";

export default DS.RESTAdapter.extend(UrlTemplates, {
  urlTemplate: "{+host}{/namespace}/my-post{/id}",
  namespace: 'api'
});
