'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import { formatMergeTag, flattenPropertyList } from './propertyUtils';
export default (function (prefix, property, properties) {
  var flatProperties = ImmutableMap();
  properties.forEach(function (_value, key) {
    var objectProperties = properties.get(key) || List();
    flatProperties = flatProperties.set(key, flattenPropertyList(objectProperties));
  });
  return formatMergeTag(prefix, property, flatProperties);
});