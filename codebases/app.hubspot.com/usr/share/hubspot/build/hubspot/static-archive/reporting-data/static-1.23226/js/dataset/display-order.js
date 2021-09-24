'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { List } from 'immutable';
import { ASC } from '../constants/sortOrder';
import { ALPHA } from '../constants/sortType';
import { collectSubaggregationKeys, createDenseDataset } from './helpers';
import { ATTRIBUTION_TOUCH_POINTS, CONTACT_CREATE_ATTRIBUTION, FEEDBACK_SUBMISSIONS } from '../constants/dataTypes';
import { GLOBAL_NULL } from '../constants/defaultNullValues';
/**
 * Display order sort property suffix
 *
 * @type {RegExp}
 * @constant
 */

var SUFFIX = /.displayOrder$/;
/**
 * Display order sort property suffix
 *
 * @param {string} property Property with suffix
 * @returns {string} Property without suffix
 */

var removeSuffix = function removeSuffix(property) {
  return typeof property === 'string' ? property.replace(SUFFIX, '') : null;
};
/**
 * Create masking function for display order
 *
 * @param {string} dataType Data type
 * @param {Immutable.Map} propertyGroups Property groups
 * @returns {function} Display order mask function
 */


var createDisplayOrderMask = function createDisplayOrderMask(dataType, propertyGroups) {
  var sorts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : List();
  return function (property) {
    return propertyGroups.hasIn([dataType, property, 'options', 0, 'displayOrder']) || sorts.some(function (sortedField) {
      return sortedField.property === property;
    }) ? property : null;
  };
};
/**
 * Create display order getter from property groups
 *
 * @param {string} dataType Data type
 * @param {Immutable.Map} propertyGroups Property groups
 * @returns {function} Display order getter function creator
 */


var createDisplayOrderGetter = function createDisplayOrderGetter(dataType, propertyGroups) {
  return function (property) {
    return function (value) {
      var options = propertyGroups.getIn([dataType, property, 'options'], List());
      var found = options.find(function (option) {
        return value === option.get('value');
      });

      if (found) {
        return found.get('displayOrder');
      }

      return value === GLOBAL_NULL ? -999 : -1;
    };
  };
};
/**
 * Create getter based comparator
 *
 * @param {function} getter Field getter
 * @param {ASC|DESC} order Sort order
 * @returns {function} Comparator function
 */


var createComparator = function createComparator(getter, order) {
  return function (first, second) {
    var _ref = [first.get('key'), second.get('key')],
        a = _ref[0],
        b = _ref[1];
    var result = order === ASC ? getter(a) - getter(b) : getter(b) - getter(a);

    if (result === 0) {
      // For equal display orders, use alpha sort on keys as tiebreaker
      var orderFactor = order === ASC ? 1 : -1;
      return orderFactor * (a >= b ? 1 : -1);
    }

    return result;
  };
};

var createAlphaGetter = function createAlphaGetter(dataType, propertyGroups, property, keys) {
  return function (value) {
    var options = propertyGroups.getIn([dataType, property, 'options'], List());
    var found = options.some(function (option) {
      return value === option.get('value');
    }) || keys.has(value);
    return found ? value : null;
  };
};

var createAlphaComparator = function createAlphaComparator(getter, order) {
  return function (first, second) {
    var _map$map = [first, second].map(function (value) {
      return value.get('key');
    }).map(getter),
        _map$map2 = _slicedToArray(_map$map, 2),
        a = _map$map2[0],
        b = _map$map2[1];

    var orderFactor = order === ASC ? 1 : -1;

    if (a === null) {
      return orderFactor * -1;
    }

    if (b === null) {
      return orderFactor;
    }

    return orderFactor * (a >= b ? 1 : -1);
  };
};

var getAlphaOrder = function getAlphaOrder(_ref2, nonDisplaySorts) {
  var property = _ref2.property,
      defaultOrder = _ref2.order;

  if (nonDisplaySorts) {
    var propertySort = nonDisplaySorts.find(function (sort) {
      return sort.property === property;
    });

    if (propertySort.type === ALPHA) {
      return propertySort.order;
    }
  }

  return defaultOrder;
};
/**
 * Get non display order sorts, excluding those which aren't on dimesion or
 * metric properties
 *
 * @param {ImmutableMap} config The report config
 * @param {object[]} sorts Configuration defined sorts
 * @returns {object} Non display order sorts
 */


var getNonDisplayOrderSorts = function getNonDisplayOrderSorts(config, sorts) {
  var sortableProperties = config.get('dimensions', List()).concat(config.get('metrics', List()).map(function (metric) {
    return metric.get('property');
  }));
  return sorts.filter(function (_ref3) {
    var property = _ref3.property;
    return !SUFFIX.test(property) && sortableProperties.includes(property);
  });
};
/**
 * Get existing dimension sorts
 *
 * @param {Iterable} dimensions Dimensions
 * @param {object[]} sorts Configuration defined sorts
 * @returns {object} Existing display order sorts
 */


var getExistingDimensionSorts = function getExistingDimensionSorts(dimensions, sorts) {
  return dimensions.reduce(function (memo, dimension) {
    var _ref4 = sorts.find(function (sort) {
      return removeSuffix(sort.property) === dimension;
    }) || {},
        _ref4$order = _ref4.order,
        order = _ref4$order === void 0 ? ASC : _ref4$order;

    return [].concat(_toConsumableArray(memo), [{
      property: dimension,
      order: order
    }]);
  }, []);
};

var nonDisplayParamSortIsOnSecondDimension = function nonDisplayParamSortIsOnSecondDimension(nonDisplayParamSorts) {
  var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      secondDimProperty = _ref5.property;

  return secondDimProperty && nonDisplayParamSorts.length === 1 && nonDisplayParamSorts[0].property === secondDimProperty;
};

var skipSortProperties = _defineProperty({}, FEEDBACK_SUBMISSIONS, ['hs_survey_name', 'hs_survey_channel', 'hs_response_group', 'hs_survey_type']);

var shouldNotDisplayOrderSort = function shouldNotDisplayOrderSort(datatype, property) {
  return skipSortProperties[datatype] && skipSortProperties[datatype].includes(property);
};
/**
 * Sort data set by display orders
 *
 * @param {Immutable.Map} config Report configuration
 * @param {Immutable.Map} propertyGroups Property groups
 * @param {Immutable.Map} data Data format
 * @returns {Immutable.Map} Data format sorted by display orders
 */


export var sortByDisplayOrder = function sortByDisplayOrder(config, propertyGroups, data) {
  var dataType = config.get('dataType');
  var dimensions = config.get('dimensions');
  var sorts = config.get('sort', List()).toJS();
  var maskDisplayOrder = createDisplayOrderMask(dataType, propertyGroups, sorts);
  var dimensionsMask = dimensions.map(maskDisplayOrder);

  if (dimensionsMask.some(Boolean)) {
    var nonDisplayParamSorts = getNonDisplayOrderSorts(config, sorts);

    var _getExistingDimension = getExistingDimensionSorts(dimensionsMask, sorts),
        _getExistingDimension2 = _slicedToArray(_getExistingDimension, 2),
        first = _getExistingDimension2[0],
        second = _getExistingDimension2[1];

    var getDisplayOrder = createDisplayOrderGetter(dataType, propertyGroups);
    var nonDisplaySortExistsOnSecondDimension = nonDisplayParamSortIsOnSecondDimension(nonDisplayParamSorts, second);
    var sorted = data;

    if (first && first.property && (nonDisplayParamSorts.length === 0 || nonDisplaySortExistsOnSecondDimension) && !shouldNotDisplayOrderSort(dataType, first.property)) {
      var getter = getDisplayOrder(first.property);
      var comparator = createComparator(getter, first.order);
      sorted = sorted.updateIn(['dimension', 'buckets'], function (buckets) {
        return buckets.sort(comparator);
      });
    }

    var secondDimensionPropertyTypeIsEnumeration = second && second.property ? propertyGroups.getIn([dataType, second.property, 'type']) === 'enumeration' : false; // Attribution exception @ssdavis

    if (second && second.property && ![ATTRIBUTION_TOUCH_POINTS, CONTACT_CREATE_ATTRIBUTION].includes(dataType) && secondDimensionPropertyTypeIsEnumeration) {
      var keys = collectSubaggregationKeys(sorted);
      var useDisplayOrderSort = !nonDisplaySortExistsOnSecondDimension && !shouldNotDisplayOrderSort(dataType, second.property);

      var _getter;

      var _comparator;

      if (useDisplayOrderSort) {
        _getter = getDisplayOrder(second.property);
        _comparator = createComparator(_getter, second.order);
      } else {
        _getter = createAlphaGetter(dataType, propertyGroups, second.property, keys);
        _comparator = createAlphaComparator(_getter, getAlphaOrder(second, nonDisplaySortExistsOnSecondDimension && nonDisplayParamSorts));
      }

      sorted = createDenseDataset(keys, sorted, config.getIn(['metrics', 0])).updateIn(['dimension', 'buckets'], function (outers) {
        return outers.map(function (outer) {
          return outer.updateIn(['dimension', 'buckets'], function (inner) {
            return inner.sort(_comparator);
          });
        });
      });
    }

    return sorted;
  }

  return data;
};
export var __TESTABLE__ = {
  removeSuffix: removeSuffix,
  createDisplayOrderMask: createDisplayOrderMask,
  createDisplayOrderGetter: createDisplayOrderGetter,
  createComparator: createComparator,
  getNonDisplayOrderSorts: getNonDisplayOrderSorts,
  getExistingDimensionSorts: getExistingDimensionSorts
};