'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { Set as ImmutableSet } from 'immutable';
import { getRequiredProperties } from '../crmObjectTypes/ObjectType';
import get from 'transmute/get';
export var getPropertiesToFetch = function getPropertiesToFetch(objectType, view) {
  // Required properties based on object type. This is a noop for legacy types
  // (e.g. CONTACT), but CrmObjectTypeRecord support is added in crm-index-ui
  var requiredProperties = getRequiredProperties(objectType);

  if (requiredProperties == null) {
    return null;
  }

  var columns = get('columns', view) || [];
  return ImmutableSet([].concat(_toConsumableArray(requiredProperties), _toConsumableArray(columns.map(function (column) {
    return column.get('name');
  })))).toArray();
};