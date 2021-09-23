'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { Set as ImmutableSet } from 'immutable';
import I18n from 'I18n';
import { Promise } from '../../lib/promise';
import { CURRENT_TIME } from '../../constants/magicTypes';
export default (function (config) {
  var paths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableSet();
  var currentTime = I18n.moment.portalTz().valueOf();
  return Promise.resolve(paths.reduce(function (memo, path) {
    return memo.updateIn(['filters'].concat(_toConsumableArray(path)), function (value) {
      return value === CURRENT_TIME ? currentTime : null;
    });
  }, config));
});