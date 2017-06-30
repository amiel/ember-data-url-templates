import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlTemplate: "{+host}{/namespace}/my-posts{/id}",
  namespace: 'api',
});
