import deparam from 'dummy/utils/deparam';

export default function() {
  this.timing = 1000;
  this.namespace = '/api';

  this.get('/my-posts', (schema, request) => {
    const paramString = request.url.split('?')[1];
    const queryParams = deparam(paramString);
    const posts = schema.posts.all();

    if (queryParams.filter) {
      return posts.filter((post) => post.title.match(queryParams.filter.term));
    } else {
      return posts;
    }
  });

  this.get('/my-posts/:slug', (schema, request) => {
    return schema.posts.findBy({ slug: request.params.slug });
  });

  this.patch('/my-posts/:slug', (schema, request) => {
    let post = schema.posts.findBy({ slug: request.params.slug });

    // We could actually update the post, but YAGNI? *shrug*
    return post;
  });

  this.get('/posts/:id');
  this.get('/posts/:post_id/comments/:id');
  this.get('/posts/:post_id/reactions');
  this.get('/posts/:post_id/author', (schema, request) => {
    let post = schema.posts.find(request.params.post_id);
    return post.author;
  });

  this.get('/posts/:post_id/related-posts', (schema, request) => {
    let post = schema.posts.find(request.params.post_id);
    return post.relatedPosts;
  });
}
