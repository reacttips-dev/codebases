'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { Set as ImmutableSet, List } from 'immutable';
import { SELECT_TOP } from '../../constants/magicTypes';
import retrieve from '../../retrieve/unified';
import * as unifiedDataTypes from '../../constants/dataTypes/unified';
import { MissingRequiredDataException } from '../../exceptions';
import { has } from '../../lib/has';
export default (function (config) {
  var paths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableSet();

  if (!has(unifiedDataTypes, config.get('dataType'))) {
    return config;
  }

  var totalsConfig = config.set('dimensions', List(['breakdown'])).updateIn(['filters', 'custom'], function (filters) {
    return filters.filter(function (filter) {
      return filter.get('values') !== SELECT_TOP;
    });
  });
  return retrieve(totalsConfig.toJS(), function () {}).then(function (response) {
    return response.dataset.getIn(['dimension', 'buckets']).map(function (bucket) {
      return bucket.get('key');
    });
  }).then(function (breakdowns) {
    if (breakdowns.isEmpty()) {
      throw new MissingRequiredDataException();
    }

    return paths.reduce(function (acc, path) {
      return acc.setIn(['filters'].concat(_toConsumableArray(path)), breakdowns);
    }, config);
  });
});