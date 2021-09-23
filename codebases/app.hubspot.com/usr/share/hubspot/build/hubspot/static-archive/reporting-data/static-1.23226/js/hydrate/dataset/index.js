'use es6';

import { List, Map as ImmutableMap, Record } from 'immutable';
import { getStage } from '../../configure/bucket/lifecyclestage';
import { SEARCH } from '../../constants/configTypes';
import { COUNT } from '../../constants/metricTypes';
import cached from '../../lib/cached';
import { debug } from '../../lib/debug';
import { shouldBeSmallScaleV1 } from '../../lib/smallScale';
import getMetricLabel from '../../public/get-metric-label';
import propertyFormatter from '../propertyFormatter';
import fetchHomeCurrency from './currency';
import * as oneOff from './one-off';
var timestamps = ['engagement.timestamp'];
var invalidMetricValueWarning = cached('invalidMetricValueWarning', function (property) {
  return console.error("[reporting-data] invalid metric value for " + property);
});
var PropertyMeta = Record({
  type: null,
  currencyCode: null,
  durationUnit: 'milliseconds',
  inverseDeltas: false,
  shouldFormat: true,
  url: null
});
export default (function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap();
  var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableMap();
  var dataset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ImmutableMap();
  var dataType = config.get('dataType');
  var configType = config.get('configType');
  var frequency = config.get('frequency');
  var smallScaleMetrics = shouldBeSmallScaleV1(dataset, config, properties);
  return fetchHomeCurrency(config, properties.get(dataType, ImmutableMap())).then(function (getCurrencyCode) {
    var getPropertyInfo = function getPropertyInfo(key) {
      // note: special case lifecycle stage bucket
      if (key === 'lifecyclestage') {
        var stage = getStage(config);

        if (stage) {
          var _property = "BUCKET_hs_lifecyclestage_" + stage + "_enteredCount";

          return properties.getIn([dataType, _property]) || ImmutableMap();
        }
      }

      var info = properties.getIn([dataType, key]) || ImmutableMap();
      var property = info.get('name');

      if (configType === SEARCH && timestamps.includes(property)) {
        return info.set('type', 'timestamp');
      }

      return info;
    };

    var hydrateMetricValue = function hydrateMetricValue(value, type, property) {
      var propertyInfo = getPropertyInfo(property);
      var oneOffLabeler = oneOff.get(property, config);
      var propertyLabel = oneOffLabeler && oneOffLabeler.format(property, config) || propertyInfo.get('label');

      if (!propertyLabel) {
        debug.once('hydrate/dataset', "missing property: " + property);
      }

      var currencyCode = getCurrencyCode(property, propertyInfo);
      var propertyType = propertyInfo.get('type');
      var durationUnit = propertyInfo.get('durationUnit');
      var propertyMeta = PropertyMeta({
        type: propertyType,
        currencyCode: propertyType === 'currency' ? currencyCode : undefined,
        durationUnit: durationUnit,
        inverseDeltas: propertyInfo.get('inverseDeltas'),
        shouldFormat: propertyInfo.get('numberDisplayHint') !== 'unformatted',
        url: propertyInfo.getIn(['options', value, 'url'])
      });
      return ImmutableMap({
        raw: value,
        formatted: propertyFormatter(value, propertyInfo, {
          currencyCode: currencyCode,
          frequency: frequency,
          metricType: type,
          configType: configType,
          dataType: dataType,
          smallScale: configType === SEARCH || smallScaleMetrics.getIn([property, type], false)
        }),
        label: getMetricLabel(propertyLabel, type, property),
        propertyMeta: propertyMeta
      });
    };

    var hydrateMetrics = function hydrateMetrics(metrics, property) {
      return metrics.map(function (number, type) {
        if (ImmutableMap.isMap(number) && (number.has('raw') || number.has('formatted'))) {
          var hydrated = hydrateMetricValue(number.get('raw'), type, property);
          return hydrated.merge(number);
        }

        if (number != null && typeof number !== 'number' && typeof number !== 'string' && !List.isList(number)) {
          invalidMetricValueWarning(property);
        }

        return hydrateMetricValue(number, type, property);
      });
    };

    var hydrateDimension = function hydrateDimension(dimension) {
      return dimension.withMutations(function (mutable) {
        var property = dimension.get('property');
        var propertyInfo = getPropertyInfo(property);
        var propertyLabel = mutable.get('propertyLabel') || propertyInfo.get('label') || property;
        mutable.set('propertyLabel', propertyLabel);

        if (dimension.has('buckets')) {
          mutable.update('buckets', function (buckets) {
            return (// eslint-disable-next-line @typescript-eslint/no-use-before-define
              buckets.map(function (bucket) {
                return hydrateBucket(bucket, propertyInfo);
              })
            );
          });
        }
      });
    };

    var hydrateBucketOrDataset = function hydrateBucketOrDataset(mutable) {
      if (mutable.has('metrics')) {
        mutable.update('metrics', function (metrics) {
          return metrics.map(hydrateMetrics);
        });
      }

      if (mutable.has('dimension')) {
        mutable.update('dimension', hydrateDimension);
      }
    };

    var hydrateBucket = function hydrateBucket(bucket, propertyInfo) {
      return bucket.withMutations(function (mutable) {
        var key = mutable.get('key');
        hydrateBucketOrDataset(mutable);

        if (key || key === '') {
          var keyLabel = mutable.get('keyLabel') || propertyFormatter(key, propertyInfo, {
            frequency: frequency
          });
          var keyLink = propertyInfo.getIn(['options', key, 'url']);

          if (keyLink) {
            mutable.set('keyLink', keyLink);
          }

          mutable.set('keyLabel', keyLabel);
        }
      });
    };

    var hydrateDataset = function hydrateDataset(data) {
      return data.withMutations(function (mutable) {
        hydrateBucketOrDataset(mutable);

        if (mutable.has('total')) {
          mutable.update('total', function (total) {
            return hydrateMetricValue(total, COUNT, 'total');
          });
        }
      });
    };

    return hydrateDataset(dataset);
  });
});