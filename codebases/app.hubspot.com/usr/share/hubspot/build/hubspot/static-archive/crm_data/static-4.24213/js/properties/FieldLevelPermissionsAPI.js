'use es6';

import { Map as ImmutableMap } from 'immutable';
import { get } from '../api/ImmutableAPI';
export var batchFetchFieldLevelPermissions = function batchFetchFieldLevelPermissions(objectTypes) {
  return Promise.all(objectTypes.map(function (type) {
    return get("crm-permissions/v1/field-level-permissions/permissions/" + encodeURIComponent(type) + "/get-all");
  })).then(function (results) {
    return results.reduce(function (acc, result, index) {
      return acc.set(objectTypes.get(index), result);
    }, ImmutableMap());
  });
};