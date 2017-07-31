export default function() {
  this.timing = 1000;
  this.namespace = '/api';

  this.get('/my-posts', 'post');
  this.get('/my-posts/:slug', (schema, request) => {
    return schema.posts.findBy({ slug: request.params.slug });
  });

  this.patch('/my-posts/:slug', (schema, request) => {
    let post = schema.posts.findBy({ slug: request.params.slug });

    // We could actually update the post, but YAGNI? *shrug*
    return post;
  });

  this.get('/posts/:post_id/comments/:id');
  this.get('/posts/:post_id/reactions');
}
