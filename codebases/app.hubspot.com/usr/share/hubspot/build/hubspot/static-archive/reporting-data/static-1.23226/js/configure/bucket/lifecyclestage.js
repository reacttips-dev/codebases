'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { Map as ImmutableMap, List } from 'immutable';
import { Promise } from '../../lib/promise';
var store = ImmutableMap();
var DISABLED = true;
export var PATTERN = /^BUCKET_(?:hs_)?lifecyclestage_([a-z]+)_.+$/;
export var PROPERTY = 'lifecyclestage';
export var PROCESSOR = 'bucket:lifecyclestage';
export var getStage = function getStage(config) {
  return store.get(config);
};
export var setStage = function setStage(config, stage) {
  store = store.set(config, stage);
};
export var configure = function configure(config) {
  var dimensions = config.get('dimensions') || List();
  var index = dimensions.findIndex(PATTERN.test.bind(PATTERN));

  if (DISABLED || index < 0) {
    return Promise.resolve(config);
  }

  var _dimensions$get$match = dimensions.get(index).match(PATTERN),
      _dimensions$get$match2 = _slicedToArray(_dimensions$get$match, 2),
      stage = _dimensions$get$match2[1];

  var updated = config.setIn(['dimensions', index], PROPERTY).update('processors', function (context) {
    return context.push(PROCESSOR);
  });
  setStage(updated, stage);
  return Promise.resolve(updated);
};