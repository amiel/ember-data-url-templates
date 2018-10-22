# Introduction

Coming soon.

## Installation

```sh
ember install ember-data-url-templates
```

Then, import and mixin `ember-data-url-templates` to your adapter. For example, to use url templates in all adapters by default,

```js
// app/adapters/application.js

import DS from 'ember-data';
import UrlTemplates from 'ember-data-url-templates';

export default DS.JSONAPIAdapter.extend(UrlTemplates, {
});
```


