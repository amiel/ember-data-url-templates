import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlTemplate: "{+host}{/namespace}/my-posts{?query*}",
  findRecordUrlTemplate: "{+host}{/namespace}/posts/{id}",
  queryRecordUrlTemplate: "{+host}{/namespace}/my-posts/{slug}",
  updateRecordUrlTemplate: "{+host}{/namespace}/my-posts/{slug}",

  authorUrlTemplate: "{+host}{/namespace}/posts/{id}/author",
  reactionsUrlTemplate: "{+host}{/namespace}/posts/{id}/reactions",

  namespace: 'api',
});
