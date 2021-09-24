'use es6';

import getPropertyValues from './getPropertyValues';
export default (function (property, dataset) {
  return getPropertyValues(property, dataset).filterNot(function (value) {
    return Boolean(value.get('label'));
  }).map(function (value) {
    return value.get('raw');
  }).toSet();
});