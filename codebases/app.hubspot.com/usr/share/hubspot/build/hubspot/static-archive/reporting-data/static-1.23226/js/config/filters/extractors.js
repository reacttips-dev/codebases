'use es6';

import { Map as ImmutableMap } from 'immutable';
import extractor from '../extractor';
import { getFilterByProperty } from './functions';

var filterExtractor = function filterExtractor(property) {
  var array = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var fallback = arguments.length > 2 ? arguments[2] : undefined;
  return extractor(function (config) {
    var filter = getFilterByProperty(config, property, ImmutableMap());

    if (array) {
      var _values = filter.get('values');

      return _values ? _values.map(String) : fallback;
    }

    var value = filter.get('value');
    return value != null ? String(value) : fallback;
  });
};

export var getValueFilterExtractor = function getValueFilterExtractor(property, fallback) {
  return filterExtractor(property, false, fallback);
};
export var getArrayFilterExtractor = function getArrayFilterExtractor(property, fallback) {
  return filterExtractor(property, true, fallback);
};
export var value = getValueFilterExtractor;
export var values = getArrayFilterExtractor;