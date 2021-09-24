import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _toStringForType;

import { CONTACT, VISIT } from 'customer-data-objects/constants/ObjectTypes';
import { getObjectType, getProperty } from 'customer-data-objects/record/ObjectRecordAccessors';
export var EMPTY_TOSTRING = '-';
var toStringForType = (_toStringForType = {}, _defineProperty(_toStringForType, VISIT, function (record) {
  return getProperty(record, 'name') || getProperty(record, 'domain') || EMPTY_TOSTRING;
}), _defineProperty(_toStringForType, CONTACT, function (record, nameFormatter) {
  var firstName = getProperty(record, 'firstname');
  var lastName = getProperty(record, 'lastname');
  var displayName = nameFormatter({
    firstName: firstName,
    lastName: lastName
  }) || getProperty(record, 'email');
  return displayName || '-';
}), _toStringForType);

function toStringByType(objectType, record, nameFormatter) {
  var maybeFormatter = toStringForType[objectType];

  if (!maybeFormatter) {
    throw new Error("ImmutableModel: toString not defined for objectType \"" + objectType + "\"");
  }

  return maybeFormatter(record, nameFormatter);
}

export function toString(nameFormatter, record) {
  if (!record) return '';

  if (Object.prototype.hasOwnProperty.call(toStringForType, getObjectType(record))) {
    return toStringByType(getObjectType(record), record, nameFormatter);
  }

  if (typeof record.constructor.toString === 'function') {
    return record.constructor.toString(record);
  }

  return toStringByType(getObjectType(record), record, nameFormatter);
}