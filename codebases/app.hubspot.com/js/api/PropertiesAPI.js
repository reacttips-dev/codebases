'use es6';

import { Map as ImmutableMap } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
export function fetchMultipleProperties(_ref) {
  var objectType = _ref.objectType,
      data = _ref.data;
  return apiClient.post("properties/v4/" + objectType + "/multi-get", {
    data: data
  }).then(function (properties) {
    var propertyMap = ImmutableMap(properties);
    return propertyMap.map(function (propertyData) {
      return PropertyRecord.fromJS(propertyData.property);
    });
  });
}