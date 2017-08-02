import DS from 'ember-data';

import { UrlTemplatesSerializer } from "ember-data-url-templates";

export default DS.JSONAPISerializer.extend(UrlTemplatesSerializer, {
});
