import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  links(model) {
    return {
      relatedPosts: {
        related: `/api/posts/${model.id}/related-posts`,
      },
    };
  },
});
