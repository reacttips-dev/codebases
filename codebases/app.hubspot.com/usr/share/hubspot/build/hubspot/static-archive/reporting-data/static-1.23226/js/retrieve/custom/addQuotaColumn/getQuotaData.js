'use es6';

import { Map as ImmutableMap } from 'immutable';
import { Config } from '../../../config';
import { getFilterByProperty } from '../../../config/filters/functions';
import * as ConfigTypes from '../../../constants/configTypes';
import { QUOTAS } from '../../../constants/dataTypes';
import * as Operators from '../../../constants/operators';
import { ENGAGEMENT_OWNER_ID } from '../../../constants/referenceTypes';
import extractUniqueValues from '../../../dataset/extract-unique-values';
import { mergeDatasets } from '../../../dataset/mergeDatasets';
import { Promise } from '../../../lib/promise';
import { retrieve as quotaRetrieve } from '../quotas/quotasRetrieve';
import { parseQuotaMetric, QUOTA_DATE_PROPERTY, QUOTA_OWNER_PROPERTY, QUOTA_PIPELINE_PROPERTY, QUOTA_TYPE_PROPERTY, QUOTA_VALUE_PROPERTY } from '../quotas/shared';

var getOwnerProperty = function getOwnerProperty(config) {
  var dimensions = config.get('dimensions');
  return dimensions.contains(ENGAGEMENT_OWNER_ID) ? ENGAGEMENT_OWNER_ID : QUOTA_OWNER_PROPERTY;
};

var fill = function fill(_ref) {
  var dataset = _ref.dataset,
      metric = _ref.metric;
  var property = metric.get('property');
  var emptyMetric = metric.get('metricTypes').toMap().mapKeys(function (k, v) {
    return v;
  }).map(function () {
    return 0;
  });
  dataset = dataset.get('metrics') ? dataset.update('metrics', function (metrics) {
    return metrics.has(property) ? metrics : metrics.set(property, emptyMetric);
  }) : dataset;
  return dataset.get('dimension') ? dataset.updateIn(['dimension', 'buckets'], function (buckets) {
    return buckets.map(function (bucket) {
      return fill({
        dataset: bucket,
        metric: metric
      });
    });
  }) : dataset;
};

export var buildQuotaConfig = function buildQuotaConfig(_ref2) {
  var primaryConfig = _ref2.primaryConfig,
      dataset = _ref2.dataset,
      ownerProperty = _ref2.ownerProperty,
      quotaMetric = _ref2.quotaMetric;
  var dateFilter = primaryConfig.getIn(['filters', 'dateRange']).set('property', QUOTA_DATE_PROPERTY);

  var _parseQuotaMetric = parseQuotaMetric(quotaMetric),
      quotaType = _parseQuotaMetric.quotaType;

  var customFilters = [{
    operator: Operators.EQ,
    property: QUOTA_TYPE_PROPERTY,
    value: quotaType
  }];
  var dimensions = primaryConfig.get('configType') === ConfigTypes.TIME_SERIES ? [QUOTA_DATE_PROPERTY] : [];
  var byOwner = primaryConfig.get('dimensions').contains(ownerProperty);

  if (byOwner) {
    dimensions.push(QUOTA_OWNER_PROPERTY); //if (primaryConfig.getIn(['filters', 'owner']))

    var owners = extractUniqueValues(ownerProperty, dataset);
    customFilters.push({
      operator: 'IN',
      property: QUOTA_OWNER_PROPERTY,
      values: owners.toList()
    });
  }

  var pipelineFilter = getFilterByProperty(primaryConfig, 'pipeline');

  if (pipelineFilter) {
    customFilters.push(pipelineFilter.set('property', QUOTA_PIPELINE_PROPERTY));
  }

  return Config({
    configType: primaryConfig.get('configType'),
    frequency: primaryConfig.get('frequency'),
    dataType: QUOTAS,
    filters: {
      dateRange: dateFilter,
      custom: customFilters
    },
    dimensions: dimensions,
    metrics: [quotaMetric.set('property', QUOTA_VALUE_PROPERTY)]
  });
};
export var getQuotaData = function getQuotaData(_ref3) {
  var primaryConfig = _ref3.primaryConfig,
      dataset = _ref3.dataset,
      quotaMetric = _ref3.quotaMetric;
  var ownerProperty = getOwnerProperty(primaryConfig);
  var quotaMetricProperty = quotaMetric.get('property');
  var quotasConfig = buildQuotaConfig({
    primaryConfig: primaryConfig,
    dataset: dataset,
    ownerProperty: ownerProperty,
    quotaMetric: quotaMetric
  });
  /* Don't request if no owners available, but still fill empty metrics */

  if (quotasConfig.get('dimensions').contains(QUOTA_OWNER_PROPERTY) && getFilterByProperty(quotasConfig, QUOTA_OWNER_PROPERTY).get('values').count() === 0) {
    return Promise.resolve(fill({
      dataset: dataset,
      metric: quotaMetric
    }));
  }

  return quotaRetrieve(quotasConfig, function () {}).then(function (_ref4) {
    var quotasDataset = _ref4.dataset;
    quotasDataset = quotasDataset.update('metrics', function (metrics) {
      return metrics.set(quotaMetricProperty, ImmutableMap({
        SUM: metrics.getIn(['hs_value', 'SUM'], 0)
      })).delete('hs_value');
    });
    var dimensionCount = quotasConfig.get('dimensions').count();

    if (dimensionCount === 1) {
      quotasDataset = quotasDataset.updateIn(['dimension', 'buckets'], function (buckets) {
        return buckets.map(function (bucket) {
          return bucket.update('metrics', function (metrics) {
            return metrics.set(quotaMetricProperty, metrics.get('hs_value')).delete('hs_value');
          });
        });
      }).setIn(['dimension', 'property'], primaryConfig.getIn(['dimensions', 0]));
    }

    if (dimensionCount === 2) {
      quotasDataset = quotasDataset.updateIn(['dimension', 'buckets'], function (buckets) {
        return buckets.map(function (bucket) {
          return bucket.updateIn(['dimension', 'buckets'], function (innerBuckets) {
            return innerBuckets.map(function (innerBucket) {
              return innerBucket.update('metrics', function (metrics) {
                return metrics.set(quotaMetricProperty, metrics.get('hs_value')).delete('hs_value');
              });
            });
          }).setIn(['dimension', 'property'], primaryConfig.getIn(['dimensions', 1]));
        });
      }).setIn(['dimension', 'property'], primaryConfig.getIn(['dimensions', 0]));
    }

    quotasDataset = mergeDatasets(quotasDataset, dataset);
    quotasDataset = fill({
      dataset: quotasDataset,
      metric: quotaMetric
    });
    return quotasDataset;
  });
};