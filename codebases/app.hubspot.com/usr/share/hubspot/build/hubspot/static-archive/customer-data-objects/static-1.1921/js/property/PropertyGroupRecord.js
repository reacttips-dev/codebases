'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { List, Record } from 'immutable';
import PropertyRecord from './PropertyRecord';
var PropertyGroupRecord = Record({
  displayName: '',
  displayOrder: 0,
  name: '',
  portalId: null,
  properties: List(),
  hubspotDefined: false
}, 'PropertyGroupRecord');

PropertyGroupRecord.fromJS = function (json) {
  var propertyRecordTransformer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : PropertyRecord.fromJS;

  if (!json || typeof json !== 'object') {
    return json;
  }

  var properties = json.properties,
      rest = _objectWithoutProperties(json, ["properties"]);

  return PropertyGroupRecord(Object.assign({}, rest, {
    properties: Array.isArray(properties) ? List(properties.map(propertyRecordTransformer)) : List()
  }));
};

export default PropertyGroupRecord;