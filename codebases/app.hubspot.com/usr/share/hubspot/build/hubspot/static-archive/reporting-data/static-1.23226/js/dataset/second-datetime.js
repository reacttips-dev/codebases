'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import I18n from 'I18n';
import { collectSubaggregationKeys, createDenseDataset } from './helpers';
/**
 * Dataset date format
 *
 * @type {string}
 * @constant
 */

var DATE_FORMAT = 'YYYY-MM-DD';
/**
 * Date property types
 *
 * @type {string[]}
 * @constant
 */

var DATE_TYPES = ['date', 'datetime'];
/**
 * Whether property is a date property
 *
 * @param {string} dataType Data type
 * @param {Immutable.Map} propertyGroups Property groups
 * @param {string} property Property to check
 * @returns {boolean} Whether property is date property
 */

var isDatetime = function isDatetime(dataType, propertyGroups, property) {
  return DATE_TYPES.includes(propertyGroups.getIn([dataType, property, 'type']));
};
/**
 * Ascending date comparator
 *
 * @param {string} first First point
 * @param {string} second Second point
 * @returns {number} Comparison value
 */


var comparator = function comparator(first, second) {
  var _map = [first, second].map(function (point) {
    return I18n.moment(point.get('key'), DATE_FORMAT);
  }),
      _map2 = _slicedToArray(_map, 2),
      a = _map2[0],
      b = _map2[1];

  return a.isBefore(b) ? -1 : 1;
};
/**
 * Sort data by datetime second dimension
 *
 * @param {Immutable.Map} config Report configuration
 * @param {Immutable.Map} propertyGroups Property groups
 * @param {Immutable.Map} data Data format
 * @returns {Immutable.Map} Data format sorted by datetime second dimension
 */


export var sortBySecondDatetime = function sortBySecondDatetime(config, propertyGroups, data) {
  var dataType = config.get('dataType');
  var property = config.getIn(['dimensions', 1]);

  if (isDatetime(dataType, propertyGroups, property)) {
    var keys = collectSubaggregationKeys(data);
    return createDenseDataset(keys, data, config.getIn(['metrics', 0])).updateIn(['dimension', 'buckets'], function (outers) {
      return outers.map(function (outer) {
        return outer.updateIn(['dimension', 'buckets'], function (inner) {
          return inner.sort(comparator);
        });
      });
    });
  }

  return data;
};
export var __TESTABLE__ = {
  isDatetime: isDatetime,
  comparator: comparator
};