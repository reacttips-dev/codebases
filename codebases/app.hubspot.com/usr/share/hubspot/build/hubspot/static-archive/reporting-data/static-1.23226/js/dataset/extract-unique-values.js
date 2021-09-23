'use es6';

import getPropertyValues from './getPropertyValues';
export default (function (property, dataset) {
  return getPropertyValues(property, dataset).map(function (value) {
    return value.raw;
  }).toSet().filter(function (value) {
    return !!value;
  });
});