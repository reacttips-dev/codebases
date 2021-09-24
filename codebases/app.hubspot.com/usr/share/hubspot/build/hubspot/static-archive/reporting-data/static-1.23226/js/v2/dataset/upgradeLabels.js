'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { List, Map as ImmutableMap, fromJS, OrderedMap } from 'immutable';
import { FUNNEL, SEARCH } from '../../constants/configTypes';
import { toMetricKey } from './datasetMetrics';
import { formatForScientificNotation } from './utils';

var getDimensionLabels = function getDimensionLabels(dimension) {
  return dimension && dimension.get('buckets') ? ImmutableMap(_defineProperty({}, dimension.get('property'), ImmutableMap({
    label: dimension.get('propertyLabel')
  }))).merge(dimension.get('buckets').flatMap(function (bucket) {
    return getDimensionLabels(bucket.get('dimension'));
  })) : ImmutableMap();
};

var readMetric = function readMetric(types, key, pluck) {
  return types.mapKeys(function (type) {
    return toMetricKey({
      property: key,
      type: type
    });
  }).map(function (value) {
    return pluck(value);
  });
};

var readMetrics = function readMetrics(metrics) {
  var pluck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (metric) {
    return metric.get('raw');
  };
  return metrics.toOrderedMap().flatMap(function (types, key) {
    return readMetric(types, key, pluck);
  });
};

var getMetricLabels = function getMetricLabels(oldDataset) {
  return readMetrics(oldDataset.get('metrics', ImmutableMap()), function (metric) {
    var format = ImmutableMap({});

    if (metric.get('propertyMeta')) {
      format = format.set('currencyCode', metric.get('propertyMeta').currencyCode);
      format = format.set('durationUnit', metric.get('propertyMeta').durationUnit);
    }

    return ImmutableMap({
      format: format,
      label: metric.get('label')
    });
  }).merge(oldDataset.getIn(['dimension', 'buckets'], List()).flatMap(function (bucket) {
    return getMetricLabels(bucket);
  }));
};

var getReferenceDimensionLabels = function getReferenceDimensionLabels(oldDataset, dimension) {
  return oldDataset.getIn(['dimension', 'buckets'], List()).toMap().flatMap(function (bucket) {
    return oldDataset.getIn(['dimension', 'property']) === dimension ? ImmutableMap(_defineProperty({}, formatForScientificNotation(bucket.get('key')), ImmutableMap({
      label: String(bucket.get('keyLabel')),
      link: bucket.get('keyLink')
    }))) : getReferenceDimensionLabels(bucket, dimension);
  });
};

var getMetricReferenceLabels = function getMetricReferenceLabels(oldDataset, dimensionsToSkip, dimensionLevel, isSearch) {
  var currentLevelMetricReferenceLabels = !dimensionsToSkip.includes(dimensionLevel) ? readMetrics(oldDataset.get('metrics') || ImmutableMap(), function (metric) {
    if (List.isList(metric.get('raw'))) {
      return metric.get('raw').reduce(function (acc, value, key) {
        if (value === null) {
          return acc;
        }

        return acc.set(String(formatForScientificNotation(value)), ImmutableMap({
          label: String(metric.get('formatted').get(key))
        }));
      }, ImmutableMap());
    }

    var _metric$get = metric.get('propertyMeta', {}),
        url = _metric$get.url;

    return metric.get('raw') !== null && metric.get('raw') !== undefined ? fromJS(_defineProperty({}, formatForScientificNotation(metric.get('raw')), {
      label: List.isList(metric.get('formatted')) ? metric.get('formatted').join(', ') : String(metric.get('formatted')),
      link: url
    })) : ImmutableMap();
  }) : OrderedMap();
  return currentLevelMetricReferenceLabels.set('', 0) // https://github.com/immutable-js/immutable-js/issues/1475
  .mergeDeep(oldDataset.getIn(['dimension', 'buckets'], List()).flatMap(function (bucket) {
    return getMetricReferenceLabels(bucket, dimensionsToSkip, dimensionLevel + 1, isSearch);
  })).delete(''); // https://github.com/immutable-js/immutable-js/issues/1475
};

var getMetricDimensionsToSkip = function getMetricDimensionsToSkip(config, isSummary) {
  if (config.get('configType') === FUNNEL && !isSummary) {
    return [0];
  }

  return [];
};

export var upgradeLabels = function upgradeLabels(config, oldDataset, isSummary) {
  var dimensions = config.get('dimensions').isEmpty() && oldDataset.has('dimension') ? List([oldDataset.getIn(['dimension', 'property'])]) : config.get('dimensions', List());
  var properties = getDimensionLabels(oldDataset.get('dimension')).merge(getMetricLabels(oldDataset));
  var isSearch = config.get('configType') === SEARCH;
  var metricDimesionsToSkip = getMetricDimensionsToSkip(config, isSummary);
  var references = dimensions.toMap().mapKeys(function (key, value) {
    return value;
  }).map(function (dimension) {
    return getReferenceDimensionLabels(oldDataset, dimension);
  }).merge(getMetricReferenceLabels(oldDataset, metricDimesionsToSkip, 0, isSearch));
  var propertiesWithReferences = properties.map(function (property, key) {
    return property.set('references', references.get(key, ImmutableMap()));
  });
  return propertiesWithReferences;
};