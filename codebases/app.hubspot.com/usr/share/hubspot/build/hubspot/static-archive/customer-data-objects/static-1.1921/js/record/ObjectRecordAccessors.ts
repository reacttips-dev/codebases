import get from 'transmute/get';
import getIn from 'transmute/getIn';
import { CRM_OBJECT } from '../constants/CrmObjectType';
export function getIdKey(record) {
  return record && record.constructor._idKey;
}
export function getId(record) {
  return record && getIn(getIdKey(record) || [], record);
}
export function getObjectType(record) {
  var objectType = record && record.constructor._objectType;
  return objectType === CRM_OBJECT ? get('objectTypeId', record) : objectType;
}
export function getProperty(record, property) {
  return record && getIn(['properties', property, 'value'], record);
}
export function getPropertyValue(record, property) {
  return record && getIn(['properties', property], record);
}