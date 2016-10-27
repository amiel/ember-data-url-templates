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
```

### Requirements

ember-data-url-templates `>= 0.1.0` is known to work with ember-data `>= 1.0.0-beta.18`, `^1.13`, and `^2.0`.

### Documentation

More in depth documentation can be found in [the wiki](https://github.com/amiel/ember-data-url-templates/wiki).

### Examples
`urlSegments` are used to build dynamic portions of the url. 
The appropriate mechanism for passing data from the application to `urlSegments` depends on i) the `DS.store` method used, and ii) where the passed state-data is stored. 

#### snapshot
```javascript
// adapters/comment

import Ember from "ember";
import DS from "ember-data";
import UrlTemplates from "ember-data-url-templates";

export default DS.RESTAdapter.extend(UrlTemplates, {
  urlTemplate: '{+host}/comments{/id}',
  urlForCreateRecord: '{+host}/users/{userId}/comments',

  urlSegments: {
    userId(type, id, snapshot, query) {
      return snapshot.belongsTo('user').id;;
    }
  }
});
```

```javascript
var user = this.store.peekRecord('user', 1);
store.createRecord('comment', {
  title: "Tomster and Zoey",
  user: user
});
```

Usage conditions:
- [Adapter](http://emberjs.com/api/data/classes/DS.JSONAPIAdapter.html) must have argument `snapshot`
- Relationship must already be defined in snapshot, e.g. `belongsTo()`, `hasMany()`

Most appropriate for:
- `DS.store.createRecord()`
- `DS.store.deleteRecord()`

#### snapshot with `adapterOptions`
```javascript
// adapters/comment

import Ember from "ember";
import DS from "ember-data";
import UrlTemplates from "ember-data-url-templates";

export default DS.RESTAdapter.extend(UrlTemplates, {
  urlTemplate: '{+host}/comments{/id}',
  urlForFindAll: '{+host}/users/{userId}/comments',

  urlSegments: {
    userId(type, id, snapshot, query) {
      return snapshot.adapterOptions.userId;
    }
  }
});
```

```javascript
// routes/users/user/comment
import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    let user = this.modelFor("users.user");
    return this.store.findAll('comment', {adapterOptions: {userId: user.id}});
  }
});
```

Usage conditions:
- [`DS.store`](http://emberjs.com/api/data/classes/DS.Store.html) must have arguement `options`
- [Adapter](http://emberjs.com/api/data/classes/DS.JSONAPIAdapter.html) must have argument `snapshot`

Most appropriate for:
- `DS.store.findRecord()`
- `DS.store.findAll()`

Gotchas:
- Snapshots are the canonical way of safely handling a record before making an API request via EmberData, but...
- Requires explictly passing `adapterOptions` with *all* `find` and `findRecord`calls. 
  * NB: The above is a minimal working example. In production, you'd want to ensure that required `adapterOptions` have been passed to `userId()` via the `snapshot`. 

#### query
```javascript
// adapters/comment

import Ember from "ember";
import DS from "ember-data";
import UrlTemplates from "ember-data-url-templates";

export default DS.RESTAdapter.extend(UrlTemplates, {
  urlTemplate: '{+host}/comments{/id}',
  queryUrlTemplate: '{+host}/users/{userId}/comments{?query*}',

  urlSegments: {
    userId(type, id, snapshot, query) {
      let userId = query.userId;
      delete query.userId // Work-around. Otherwise, the query string will include `userId`
      return userId;
    }
  }
});
```

```javascript
// routes/users/user/comment
import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    let user = this.modelFor("users.user");
    return this.store.queryRecord('comment', { userId: user.id });
  }
});
```

Usage conditions:
- [`DS.store`](http://emberjs.com/api/data/classes/DS.Store.html) must have arguement `query`
- [Adapter](http://emberjs.com/api/data/classes/DS.JSONAPIAdapter.html) must have argument `query`

Most appropriate for:
- `DS.store.queryecord()`
- `DS.store.query()`

Gotchas:
- Requires use of `store.query()` or `store.queryRecord()`. 
  * The other store methods don't support `query`, i.e. `null` value passed to `userId` in `urlSegments`.
- 'Special treatment' of *apparent* query params (`this.store`) being used in the path.
  * EmberData's default query methods expose adapter-level semantics by a 1:1 mapping of query (`store`) --> query string (url built by adapter).
  
#### session
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

```javascript
// routes/users/user/comment
import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    let user = this.modelFor("users.user");
    return this.store.findAll('comment');
  }
});
```

Usage conditions:
- Must store state in session
- Not dependent on [`DS.store`](http://emberjs.com/api/data/classes/DS.Store.html) or [Adapter](http://emberjs.com/api/data/classes/DS.JSONAPIAdapter.html).

Most appropriate for:
- When it makes sense to store global state in a service/singleton
- Works for all `DS.store` methods

Gotchas:
- Easy to use, but be very careful about managing URI-related application state outside of the ember router. 
  * Probably o.k. for a `userId`.
  * Probably not o.k. for duplicating state from a URI segment, e.g. `parent/<parent_id>/child`, with `<parent_id>` being stored in a session.

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
