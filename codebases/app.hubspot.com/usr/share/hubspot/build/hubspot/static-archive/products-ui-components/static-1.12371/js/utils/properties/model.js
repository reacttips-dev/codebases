'use es6';

import { setProperty } from 'customer-data-objects/model/ImmutableModel';
import { CRM_UI } from 'customer-data-objects/property/PropertySourceTypes';
/**
 * Sets all properties onto line item, returns line item
 *
 * @param {Record} subject
 * @param {iterable<PropertyValueRecord>} propertyValues - List of objects that support destructuring with name: value
 * @returns {Record} line item with all properties set
 */

export var setPropertiesOnRecord = function setPropertiesOnRecord(subject) {
  var propertyValues = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return propertyValues.reduce(function (acc, _ref) {
    var name = _ref.name,
        value = _ref.value;
    return setProperty(acc, name, value);
  }, subject);
};
/**
 * Sets all properties onto line item, returns line item
 *
 * @param {Record} subject
 * @param {object} propertyMap - object containing a map of propertyName: propertyValue
 * @returns {Record} line item with calculated properties set
 */

export function setPropertyMapOnRecord(_ref2) {
  var subject = _ref2.subject,
      _ref2$propertyMap = _ref2.propertyMap,
      propertyMap = _ref2$propertyMap === void 0 ? {} : _ref2$propertyMap;
  return Object.keys(propertyMap).reduce(function (acc, propertyName) {
    return setProperty(acc, propertyName, propertyMap[propertyName], CRM_UI);
  }, subject);
}