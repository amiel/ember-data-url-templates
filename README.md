# ember-data-url-templates

[![Build Status](https://travis-ci.org/amiel/ember-data-url-templates.svg)](https://travis-ci.org/amiel/ember-data-url-templates)
[![Ember Observer Score](http://emberobserver.com/badges/ember-data-url-templates.svg)](http://emberobserver.com/addons/ember-data-url-templates)
[![Dependency Status](https://david-dm.org/amiel/ember-data-url-templates.svg)](https://david-dm.org/amiel/ember-data-url-templates)
[![devDependency Status](https://david-dm.org/amiel/ember-data-url-templates/dev-status.svg)](https://david-dm.org/amiel/ember-data-url-templates?type=dev)

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
```

### Requirements

ember-data-url-templates `>= 0.1.0` is known to work with ember-data `>= 1.0.0-beta.18`, `^1.13`, and `^2.0`.

### Documentation

More in depth documentation can be found in [the wiki](https://github.com/amiel/ember-data-url-templates/wiki).

### Synopsis

```javascript
// adapters/comment

import Ember from "ember";
import DS from "ember-data";
import UrlTemplates from "ember-data-url-templates";

export default DS.RESTAdapter.extend(UrlTemplates, {
  urlTemplate: '{+host}/comments{/id}',
  queryUrlTemplate: '{+host}/comments{?query*}',
  createRecordUrlTemplate: '{+host}/users/{userId}/comments',

  session: Ember.inject.service(),

  urlSegments: {
    userId() {
      return this.get('session.userId');
    }
  }
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

* Use a template provided by the API (like `links`)
