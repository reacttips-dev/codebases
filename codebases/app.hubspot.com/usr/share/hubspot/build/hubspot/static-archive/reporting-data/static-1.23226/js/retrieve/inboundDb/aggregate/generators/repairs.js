'use es6';

import { LINE_ITEMS } from '../../../../constants/dataTypes';
import { DEFAULT_NULL_VALUES } from '../../../../constants/defaultNullValues';
import { NUMBER } from '../../../../constants/property-types';
export var fixLineItemAggregations = function fixLineItemAggregations(aggregations) {
  return aggregations.map(function (aggregation) {
    return aggregation.update('subAggregations', function (subAggregations) {
      return subAggregations && fixLineItemAggregations(subAggregations);
    });
  });
};
export var fixProductIdRequest = function fixProductIdRequest(dataType) {
  return function (request) {
    if (dataType === LINE_ITEMS && request.has('aggregations')) {
      return request.update('aggregations', fixLineItemAggregations);
    }

    return request;
  };
};
export var fixNumericMissingBucket = function fixNumericMissingBucket(aggregations, properties) {
  return aggregations.map(function (buckets, property) {
    return buckets.map(function (bucket) {
      return bucket.update('key', function (key) {
        if (properties.getIn([property, 'type']) !== NUMBER && !properties.getIn([property, 'reportingOverwrittenNumericType'], false)) {
          return key;
        }

        var parsed = parseFloat(key);
        return parsed === DEFAULT_NULL_VALUES.NUMBER ? DEFAULT_NULL_VALUES.ENUMERATION : String(parsed);
      }).update('aggregations', function (subAggregations) {
        return subAggregations && fixNumericMissingBucket(subAggregations, properties);
      });
    });
  });
};
export var fixNumericBucketResponse = function fixNumericBucketResponse(response, properties) {
  if (response.has('aggregations')) {
    return response.update('aggregations', function (aggregations) {
      return fixNumericMissingBucket(aggregations, properties);
    });
  }

  return response;
};

var fixAmountMetricsRequest = function fixAmountMetricsRequest(f) {
  return function (request) {
    return request.update('metrics', function (metrics) {
      return metrics && metrics.map(function (metric) {
        return metric.update('property', f);
      });
    }).update('sort', function (sort) {
      return sort && sort.update('property', f);
    }).update('subAggregations', function (aggs) {
      return aggs && aggs.map(fixAmountMetricsRequest(f));
    }).update('aggregations', function (aggs) {
      return aggs && aggs.map(fixAmountMetricsRequest(f));
    });
  };
};

export var fixDealAmountRequest = function fixDealAmountRequest(f) {
  return function (request) {
    return fixAmountMetricsRequest(f)(request).update('filterGroups', function (filterGroups) {
      return filterGroups && filterGroups.map(function (group) {
        return group.update('filters', function (filters) {
          return filters.map(function (filter) {
            return filter.update('property', f);
          });
        });
      });
    });
  };
};
export var fixDealAmountResponse = function fixDealAmountResponse(f) {
  return function (response) {
    return response.update('metrics', function (metrics) {
      return metrics && metrics.mapKeys(f);
    }).update('aggregations', function (aggs) {
      return aggs && aggs.map(function (buckets) {
        return buckets.map(fixDealAmountResponse(f));
      });
    });
  };
};