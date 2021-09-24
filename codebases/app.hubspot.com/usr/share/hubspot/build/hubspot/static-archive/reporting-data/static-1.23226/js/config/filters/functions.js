'use es6';

import { List } from 'immutable';

var getFilters = function getFilters(config) {
  return config.getIn(['filters', 'custom'], List());
};

export var getFilterByOperator = function getFilterByOperator(config, operator) {
  var missingValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return getFilters(config).find(function (filter) {
    return filter.get('operator') === operator;
  }, null, missingValue);
};
export var getFilterByProperty = function getFilterByProperty(config, property) {
  var missingValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return getFilters(config).find(function (filter) {
    return filter.get('property') === property;
  }, null, missingValue);
};