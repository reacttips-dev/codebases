'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import update from 'transmute/update';
import { objectEntries } from '../../objectUtils/objectEntries';
import { useMemo } from 'react';
import { useRecentlyUsedPropertiesValue } from './useRecentlyUsedPropertiesValue';

var calculateRecentlyUsedPropertyNames = function calculateRecentlyUsedPropertyNames(value) {
  var usageCountsByPropertyName = value.reduce(function (propertyCounts, _ref) {
    var name = _ref.name;
    return update(name, function () {
      var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return count + 1;
    }, propertyCounts);
  }, {});
  return objectEntries(usageCountsByPropertyName).sort(function (_ref2, _ref3) {
    var _ref4 = _slicedToArray(_ref2, 2),
        __aName = _ref4[0],
        aCount = _ref4[1];

    var _ref5 = _slicedToArray(_ref3, 2),
        __bName = _ref5[0],
        bCount = _ref5[1];

    return bCount - aCount;
  }).map(function (_ref6) {
    var _ref7 = _slicedToArray(_ref6, 1),
        name = _ref7[0];

    return name;
  });
};

export var useRecentlyUsedPropertyNames = function useRecentlyUsedPropertyNames() {
  var value = useRecentlyUsedPropertiesValue();
  return useMemo(function () {
    return calculateRecentlyUsedPropertyNames(value);
  }, [value]);
};