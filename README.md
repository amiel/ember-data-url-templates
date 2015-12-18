# ember-data-url-templates

[![Build Status](https://travis-ci.org/amiel/ember-data-url-templates.svg)](https://travis-ci.org/amiel/ember-data-url-templates)
[![Ember Observer Score](http://emberobserver.com/badges/ember-data-url-templates.svg)](http://emberobserver.com/addons/ember-data-url-templates)

ember-data-url-templates is an addon to allow building urls with url templates instead of
defining `buildURL` as described in [RFC #4](https://github.com/emberjs/rfcs/pull/4).

ember-data-url-templates is under early development. Feedback is welcome, and of course,
so are pull requests.

Url templates are compiled with [geraintluff/uri-templates](https://github.com/geraintluff/uri-templates),
which fully implements [RFC 6570](http://tools.ietf.org/html/rfc6570).

## Usage

### Installation

```shell
ember install ember-data-url-templates
ember generate ember-data-url-templates
```

### Requirements

ember-data-url-templates 0.1 requires ember-data `=> 1.13.0`.

### Synopsis

```javascript
// adapters/comment

import DS from "ember-data";
import UrlTemplates from "ember-data-url-templates";

export default DS.RESTAdapter.extend(UrlTemplates, {
  urlTemplate: '{+host}/posts/{postId}/comments{/id}',
  findUrlTemplate: '{+host}/comments/{id}',
  createRecordUrlTemplate: '{+host}/users/{userId}/comments',

  currentUser: Ember.inject.service(),

  urlSegments: {
    postId(type, id, snapshot, query) {
      return snapshot.belongsTo('post', { id: true });
    },

    userId() {
      return this.get('currentUser.id');
    }
  }
});
```

### `query` and `queryRecord`

The entire query from `query` can be included in the url with `{?query*}`.

```javascript
// adapter
queryUrlTemplate: '/posts{?query*}'

store.query('post', { month: 6, year: 2015 });
// => /posts?month=6&year=2015
```

Or, selective keys from `query` can be used in the url.

```javascript
// adapter
queryUrlTemplate: '/blog/{category}{/year}{/month}'

store.query('post', { category: 'featured', year: 2015 });
// => /blog/featured/2015
```

## Contributing

### Installation

* `git clone` this repository
* `npm install`
* `bower install`

### Running Tests

* `ember test` or
* `ember test --server`

## TODO

Here is a short list of things I'd like to support:

* Use a template provided by the API (like `links`)
