'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import debounce from 'transmute/debounce';
import { useState, useEffect, useCallback, useMemo } from 'react';

var buildQuery = function buildQuery(searchQuery) {
  return {
    query: searchQuery,
    count: 50,
    offset: 0
  };
};

export default (function (search, transformData) {
  var initialQuery = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var minimumSearch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      data = _useState2[0],
      setData = _useState2[1];

  var _useState3 = useState(initialQuery),
      _useState4 = _slicedToArray(_useState3, 2),
      searchQuery = _useState4[0],
      _setSearchQuery = _useState4[1];

  var _useState5 = useState(true),
      _useState6 = _slicedToArray(_useState5, 2),
      isLoading = _useState6[0],
      setLoading = _useState6[1];

  var performSearch = useCallback(function (_searchQuery) {
    setLoading(true);
    search(buildQuery(_searchQuery)).then(function (results) {
      setData(results);
      setLoading(false);
    });
  }, [search, setData, setLoading]);
  var debouncedSearch = useMemo(function () {
    return debounce(200, performSearch);
  }, [performSearch]);
  var setSearchQuery = useCallback(function (newSearchQuery) {
    _setSearchQuery(newSearchQuery);
  }, [_setSearchQuery]);
  useEffect(function () {
    if (searchQuery.length < minimumSearch) {
      return;
    }

    debouncedSearch(searchQuery);
  }, [debouncedSearch, searchQuery, minimumSearch]);
  var options = useMemo(function () {
    return transformData ? transformData(data) : data;
  }, [data, transformData]);
  return [data, searchQuery, setSearchQuery, options, isLoading];
});