# ember-data-url-templates

[![Build Status](https://travis-ci.org/amiel/ember-data-url-templates.svg)](https://travis-ci.org/amiel/ember-data-url-templates)

ember-data-url-templates is an addon to allow building urls with url templates instead of
defining `buildURL` as described in [RFC #4](https://github.com/emberjs/rfcs/pull/4).

## Usage

### Installation

```shell
ember install ember-data-url-templates
ember generate ember-data-url-templates
```

### Synopsis

```javascript
// adapters/comment

import DS from "ember-data";
import UrlTemplates from "ember-data-url-templates";

extend default DS.RESTAdapter(UrlTemplates, {
  findUrlTemplate: '{+host}/comments/{id}',
  urlTemplate: '{+host}/posts/{postId}/comments{/id}'
});
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

* Optionally specify a template for each requestType
* Use a template provided by the API (like `links`)
* Use the query from `findQuery` to fill the template
