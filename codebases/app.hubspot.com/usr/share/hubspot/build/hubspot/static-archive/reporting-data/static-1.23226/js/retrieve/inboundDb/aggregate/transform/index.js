'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { List } from 'immutable';
import zeroFill from '../../../../lib/zeroFill';
import { matchCreated } from '../../../../configure/bucket/created';
import { sortByDisplayOrder } from '../../../../dataset/display-order';
import { sortBySecondDatetime } from '../../../../dataset/second-datetime';
import * as preconditions from '../preconditions';
import transformZeroDimensionalData from './zeroDimension';
import transformOneDimensionalData from './oneDimension';
import transformTwoDimensionalData from './twoDimension';
import * as dealprogress from '../../../../configure/bucket/dealprogress';

var restoreBucketProperty = function restoreBucketProperty(config, response, properties) {
  var dimensions = config.get('dimensions');

  var _dimensions$map = dimensions.map(function (dimension) {
    return properties.hasIn([dimension, 'property']);
  }),
      _dimensions$map2 = _slicedToArray(_dimensions$map, 2),
      first = _dimensions$map2[0],
      second = _dimensions$map2[1];

  return response.update('aggregations', function (original) {
    var updated = original;

    if (first) {
      updated = updated.mapKeys(function () {
        return dimensions.first();
      });
    }

    if (second) {
      updated = updated.update(dimensions.first(), function (subaggregations) {
        return subaggregations.map(function (subaggregation) {
          return subaggregation.update('aggregations', function (aggregations) {
            return aggregations.mapKeys(function () {
              return dimensions.get(1);
            });
          });
        });
      });
    }

    return updated;
  });
};

var baseTransform = function baseTransform(config, response, properties) {
  var dimensionality = config.get('dimensions').size;

  switch (dimensionality) {
    case 0:
      return transformZeroDimensionalData(config, response, properties);

    case 1:
      return transformOneDimensionalData(config, response);

    case 2:
      return transformTwoDimensionalData(config, response);

    default:
      throw new Error("expected valid dimensionality, but got " + dimensionality);
  }
};

var paginate = function paginate(config, dataset) {
  if (config.getIn(['dimensions', 0]) === dealprogress.SCRIPTED) {
    return dataset;
  }

  var offset = config.get('offset') || 0;
  var limit = config.get('limit');
  return dataset.updateIn(['dimension', 'buckets'], List(), function (buckets) {
    return limit ? buckets.skip(offset).take(limit) : buckets;
  });
};

var shouldFill = function shouldFill(config, properties) {
  var firstDimension = config.getIn(['dimensions', 0], List());
  return ['date', 'datetime'].includes(properties.getIn([firstDimension, 'type']));
};

export default (function (propertiesByDataType) {
  return function (config, response) {
    preconditions.transform(response);

    if (matchCreated(config)) {
      config = config.set('dimensions', List());
    }

    var dataType = config.get('dataType');
    var properties = propertiesByDataType.get(dataType);
    var restored = restoreBucketProperty(config, response, properties);
    var transformed = baseTransform(config, restored, properties);
    var filled = shouldFill(config, properties) ? zeroFill(config, transformed) : transformed;
    var sorted = [sortByDisplayOrder, sortBySecondDatetime].reduce(function (processed, transformer) {
      return transformer(config, propertiesByDataType, processed);
    }, filled);
    return paginate(config, sorted);
  };
});