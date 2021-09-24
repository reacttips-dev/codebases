'use es6';

import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
var API_URL = 'sales/v1/property-requirements';
export function fetch(_ref) {
  var objectType = _ref.objectType;
  return ImmutableAPI.get(API_URL + "/" + objectType + "/CREATE");
}
export function saveCreatorProperties(_ref2) {
  var objectType = _ref2.objectType,
      properties = _ref2.properties;
  return ImmutableAPI.put(API_URL + "/" + objectType + "/CREATE", properties);
}