'use es6';

import { Map as ImmutableMap } from 'immutable';
import settled from '../lib/settled';
export var combine = function combine() {
  for (var _len = arguments.length, getters = new Array(_len), _key = 0; _key < _len; _key++) {
    getters[_key] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return settled(getters.map(function (getter) {
      return getter.apply(void 0, args);
    })).then(function (resolves) {
      return resolves.filter(function (_ref) {
        var state = _ref.state;
        return state === 'fulfilled';
      }).map(function (_ref2) {
        var value = _ref2.value;
        return value;
      }).reduce(function (merged, references) {
        return merged.mergeDeep(references);
      }, ImmutableMap());
    });
  };
};