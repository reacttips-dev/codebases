'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _HISTOGRAM_TYPES;

import { fromJS, List, Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { Metric } from '../../../../config/metrics';
import { matchCreated } from '../../../../configure/bucket/created';
import * as Frequency from '../../../../constants/frequency';
import { CONTACT_SEARCH_AGGREGATION_MAX_SIZE, CONTACT_SEARCH_AGGREGATION_MIN_SIZE, MAX_NUM_OF_METRICS } from '../../../../constants/limits';
import * as MetricTypes from '../../../../constants/metricTypes';
import { IN } from '../../../../constants/operators';
import { STRING } from '../../../../constants/property-types';
import { ASC } from '../../../../constants/sortOrder';
import * as SortType from '../../../../constants/sortType';
import { DeprecatedPropertyException, InvalidPropertiesException, TooManyMetricsException } from '../../../../exceptions';
import invariant from '../../../../lib/invariant';
import { countUniqueMetrics } from '../../../../lib/countUniqueMetrics';
import getfilterGroupsExtractor from '../../common/extractors/filterGroups';
import { DEFAULT_NULL_VALUES } from '../../../../constants/defaultNullValues';
var AGGREGATION_TYPES = {
  DATE: 'DATE_HISTOGRAM',
  DATETIME: 'DATE_HISTOGRAM',
  TIMESTAMP: 'DATE_HISTOGRAM',
  ENUMERATION: 'TERMS',
  STRING: 'TERMS',
  CURRENCY: 'TERMS',
  NUMBER: 'TERMS',
  ID: 'TERMS',
  PERCENT: 'TERMS',
  BOOL: 'TERMS',
  BUCKETS: 'BUCKETS'
};
var HISTOGRAM_TYPES = (_HISTOGRAM_TYPES = {}, _defineProperty(_HISTOGRAM_TYPES, Frequency.DAY, {
  intervalUnit: 'DAY'
}), _defineProperty(_HISTOGRAM_TYPES, Frequency.WEEK, {
  intervalUnit: 'WEEK'
}), _defineProperty(_HISTOGRAM_TYPES, Frequency.MONTH, {
  intervalUnit: 'MONTH'
}), _defineProperty(_HISTOGRAM_TYPES, Frequency.QUARTER, {
  intervalUnit: 'QUARTER'
}), _defineProperty(_HISTOGRAM_TYPES, Frequency.YEAR, {
  intervalUnit: 'YEAR'
}), _HISTOGRAM_TYPES);
var DEFAULT_FREQUENCY = Frequency.MONTH;
var DEPRECATED_PROPERTIES = ['hs_deal_closed_won_date' // RA-1411
];

var shouldStripSubaggMetricSort = function shouldStripSubaggMetricSort(sort) {
  return !sort.type || sort.type === SortType.COUNT || sort.type === SortType.METRIC && !/.displayOrder$/.test(sort.property);
};

var cleanAggregations = function cleanAggregations(inputAggregation, definition) {
  var size = inputAggregation.size,
      property = inputAggregation.property,
      type = inputAggregation.type,
      sort = inputAggregation.sort,
      metrics = inputAggregation.metrics,
      subAggregations = inputAggregation.subAggregations,
      buckets = inputAggregation.buckets;
  var aggregation = {
    size: size,
    property: property,
    type: type
  };

  if (sort != null) {
    if (sort.property === 'count' || sort.type === SortType.COUNT) {
      sort.type = SortType.COUNT;
      delete sort.metricType;
    } else if (sort.type !== SortType.ALPHA) {
      sort.type = SortType.METRIC;
      var sortMetric = metrics.find(function (_ref) {
        var prop = _ref.property;
        return prop === sort.property;
      });

      if (!sortMetric) {
        sortMetric = {
          property: sort.property,
          metricTypes: [sort.metricType || MetricTypes.SUM]
        };
        metrics.push(sortMetric);
      }

      if (!sort.metricType) {
        sort.metricType = sortMetric.metricTypes[0] || MetricTypes.SUM;
      }
    }

    aggregation.sort = sort;
  }

  if (metrics != null && metrics.length !== 0) {
    aggregation.metrics = metrics;
  }

  if (subAggregations != null) {
    aggregation.subAggregations = subAggregations;
  }

  if (type === 'BUCKETS') {
    var actual = definition.get('property');

    if (actual) {
      aggregation.property = actual;
    }

    aggregation.buckets = buckets;
  }

  return aggregation;
};

var buildMetrics = function buildMetrics(config) {
  return config.get('metrics', List()).filter(function (metric) {
    return metric.get('property') !== 'count';
  }).groupBy(function (metric) {
    return metric.get('property');
  }).map(function (metrics, property) {
    return metrics.reduce(function (metric, nextMetric) {
      return Metric({
        property: property,
        metricTypes: ImmutableSet(nextMetric.get('metricTypes').concat(metric.get('metricTypes'))).toList(),
        percentiles: metric.get('percentiles') || nextMetric.get('percentiles')
      });
    });
  }).valueSeq().toSet().toJS();
};

var stableSort = function stableSort(config, dimensions, property, sort) {
  var dimensionCount = config.get('dimensions').count();
  var isSubAggregation = dimensionCount === 2 && dimensions.count() === 1;

  if (!isSubAggregation || sort && !shouldStripSubaggMetricSort(sort)) {
    return sort;
  }

  return {
    property: property,
    order: ASC,
    type: SortType.ALPHA
  };
};

var buildAggregations = function buildAggregations(config, dimensions, properties) {
  if (dimensions.isEmpty()) {
    return null;
  }

  var limit = config.get('limit') || 0;
  var size = limit;

  if (limit >= CONTACT_SEARCH_AGGREGATION_MAX_SIZE) {
    size = CONTACT_SEARCH_AGGREGATION_MAX_SIZE;
  } else if (limit <= CONTACT_SEARCH_AGGREGATION_MIN_SIZE) {
    size = CONTACT_SEARCH_AGGREGATION_MIN_SIZE;
  }

  var property = dimensions.first();
  var definition = properties.get(property, ImmutableMap());
  var propertyType = definition.get('type');
  var defaultNullValue = definition.get('defaultNullValue', DEFAULT_NULL_VALUES[definition.get('reportingOverwrittenNumericType') ? 'NUMBER' : propertyType.toUpperCase()]);
  var aggType = AGGREGATION_TYPES[propertyType.toUpperCase()];
  var sortableProperties = config.get('metrics').reduce(function (memo, metric) {
    return memo.add(metric.get('property'));
  }, ImmutableSet());
  var aggSort = config.get('sort', List()).find(function (sort) {
    return sortableProperties.includes(sort.get('property')) || typeof sort.get('property') === 'string' && sort.get('property').startsWith(property);
  });
  var buckets = definition.get('buckets');
  var aggregation = cleanAggregations(Object.assign({
    size: size,
    property: property,
    type: aggType,
    sort: stableSort(config, dimensions, property, aggSort ? aggSort.toJS() : null),
    metrics: buildMetrics(config),
    subAggregations: buildAggregations(config, dimensions.rest(), properties)
  }, aggType === 'BUCKETS' ? {
    buckets: buckets
  } : {}), definition);

  switch (aggType) {
    case 'DATE_HISTOGRAM':
      {
        var frequency = config.get('frequency') || DEFAULT_FREQUENCY;
        return [Object.assign({}, aggregation, {}, HISTOGRAM_TYPES[frequency])];
      }

    case 'TERMS':
      return [Object.assign({}, aggregation, {}, defaultNullValue != null ? {
        defaultNullValue: defaultNullValue
      } : {})];

    case 'BUCKETS':
      return [aggregation];

    default:
      return invariant(false, 'expected valid property type for aggregation dimension, but got %s', propertyType);
  }
};
/**
 * Validate dimensions and filter groups
 * @param {List} dimensions Dimensions
 * @param {Array} filterGroups Filter groups
 * @param {List} metrics Metrics
 * @param {Map} properties Datatype properties
 * @throws
 */


var validateProperties = function validateProperties(dimensions, filterGroups, metrics, properties) {
  var keys = properties.keySeq().toSet();

  var missing = function missing(property) {
    return !keys.includes(property);
  };

  var invalidDimensions = dimensions.reduce(function (checks, property) {
    return [].concat(_toConsumableArray(checks), _toConsumableArray(missing(property) ? [property] : []));
  }, []);
  var invalidFilters = filterGroups.reduce(function (checks, _ref2) {
    var filters = _ref2.filters;
    return [].concat(_toConsumableArray(checks), _toConsumableArray(filters.reduce(function (memo, _ref3) {
      var property = _ref3.property;
      return [].concat(_toConsumableArray(memo), _toConsumableArray(missing(property) ? [property] : []));
    }, [])));
  }, []);
  var invalidMetrics = metrics.map(function (metric) {
    return metric.get('property');
  }).reduce(function (checks, property) {
    return [].concat(_toConsumableArray(checks), _toConsumableArray(missing(property) ? [property] : []));
  }, []);
  var invalid = [].concat(_toConsumableArray(invalidDimensions), _toConsumableArray(invalidFilters), _toConsumableArray(invalidMetrics));

  var _invalid$filter = invalid.filter(function (property) {
    return DEPRECATED_PROPERTIES.includes(property);
  }),
      _invalid$filter2 = _slicedToArray(_invalid$filter, 1),
      deprecated = _invalid$filter2[0];

  if (deprecated != null) {
    // after this has been live for a while, run a job that just deletes
    // any report with this property
    throw new DeprecatedPropertyException(deprecated);
  } else if (invalid.length > 0) {
    throw new InvalidPropertiesException(invalid);
  } else if (countUniqueMetrics(metrics) > MAX_NUM_OF_METRICS) {
    throw new TooManyMetricsException();
  }
};
/**
 * Build a ContactsSearch request
 * @param  {Map} config report configuration
 * @param  {Map} propertyGroups Property groups
 * @return {ContactsSearch} Contact search payload
 * @throws
 */


export default (function (config, propertyGroups) {
  if (matchCreated(config)) {
    config = config.set('dimensions', List());
  }

  var dataType = config.get('dataType');
  var properties = propertyGroups.get(dataType);
  var filterGroupsExtractor = getfilterGroupsExtractor();
  var filterGroups = filterGroupsExtractor(config);
  filterGroups[0].filters.forEach(function (filter) {
    if (filter.operator !== IN) {
      return;
    }

    var property = properties.get(filter.property);

    if (property && property.get('type') === STRING) {
      filter.propertySuffix = 'raw';
    }
  });
  var metrics = config.get('metrics');
  var dimensions = config.get('dimensions');
  validateProperties(dimensions, filterGroups, metrics, properties);
  var payload = dimensions.isEmpty() ? fromJS({
    metrics: buildMetrics(config),
    filterGroups: filterGroups
  }) : fromJS({
    aggregations: buildAggregations(config, dimensions, properties),
    metrics: buildMetrics(config),
    filterGroups: filterGroups
  });
  return fromJS(payload);
});