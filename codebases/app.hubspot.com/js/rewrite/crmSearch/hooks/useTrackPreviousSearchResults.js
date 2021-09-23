'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useEffect, useState } from 'react';
import get from 'transmute/get';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';

var getDataToRender = function getDataToRender(_ref) {
  var data = _ref.data,
      previousData = _ref.previousData,
      loading = _ref.loading;

  // If the current query is loading and we have previous data tracked in state,
  // we should return that previous data. If loading and we do not have previous
  // data tracked in state, we should return undefined.
  if (loading) {
    return previousData || undefined;
  } // Otherwise we are not loading and so should be able to use the current data


  return data;
};

export var useTrackPreviousSearchResults = function useTrackPreviousSearchResults(_ref2) {
  var data = _ref2.data,
      loading = _ref2.loading,
      __error = _ref2.error;
  var objectTypeId = useSelectedObjectTypeId(); // We track the previous set of data here so that we can show that previous dataset
  // under a loading spinner while the next dataset is loading.

  var _useState = useState({}),
      _useState2 = _slicedToArray(_useState, 2),
      previousDataMap = _useState2[0],
      setPreviousData = _useState2[1];

  var previousData = get(objectTypeId, previousDataMap);
  useEffect(function () {
    if (!loading && data) {
      setPreviousData(function (dataMap) {
        return Object.assign({}, dataMap, _defineProperty({}, objectTypeId, data));
      });
    }
  }, [data, loading, objectTypeId]);
  return getDataToRender({
    data: data,
    previousData: previousData,
    loading: loading
  });
};