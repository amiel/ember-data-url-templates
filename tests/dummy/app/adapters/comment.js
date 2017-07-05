import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  namespace: 'api',
  urlTemplate: "{/namespace}/posts/{postId}/comments{/id}",
});
