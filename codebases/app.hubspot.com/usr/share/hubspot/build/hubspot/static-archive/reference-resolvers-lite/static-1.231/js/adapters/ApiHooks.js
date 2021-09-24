'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { isIdle, STATUS_ERROR, STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from '../Status';
import { useEffect, useState } from 'react';
import { defaultQueryOptions } from '../internals/Search';
export var useFetchAllApiResolver = function useFetchAllApiResolver(resolver) {
  var all = resolver.api.all;

  var _useState = useState({
    status: STATUS_LOADING
  }),
      _useState2 = _slicedToArray(_useState, 2),
      results = _useState2[0],
      setResults = _useState2[1];

  useEffect(function () {
    var setData = function setData(data) {
      return setResults({
        status: STATUS_SUCCESS,
        data: data
      });
    };

    var setError = function setError(error) {
      return setResults({
        status: STATUS_ERROR,
        error: error
      });
    };

    all().then(setData, setError).done();
  }, [all]);
  return results;
};
export var useFetchApiResolver = function useFetchApiResolver(resolver, id) {
  var byId = resolver.api.byId;
  var initialStatus = id ? STATUS_LOADING : STATUS_IDLE;

  var _useState3 = useState({
    status: initialStatus
  }),
      _useState4 = _slicedToArray(_useState3, 2),
      results = _useState4[0],
      setResults = _useState4[1];

  if (id && isIdle(results.status)) {
    setResults({
      status: STATUS_LOADING
    });
  }

  useEffect(function () {
    var setData = function setData(data) {
      return setResults({
        status: STATUS_SUCCESS,
        data: data
      });
    };

    var setError = function setError(error) {
      return setResults({
        status: STATUS_ERROR,
        error: error
      });
    };

    if (!id) {
      setData(undefined); // trigger a state update if id is falsey

      return;
    }

    byId(id).then(setData, setError).done();
  }, [id, byId]);
  return results;
};
export var useSearchApiResolver = function useSearchApiResolver(resolver, queryOptions) {
  queryOptions = Object.assign({}, defaultQueryOptions, {}, queryOptions);
  var _queryOptions = queryOptions,
      query = _queryOptions.query,
      count = _queryOptions.count,
      offset = _queryOptions.offset;
  var search = resolver.api.search;
  var initialStatus = query == null ? STATUS_IDLE : STATUS_LOADING;

  var _useState5 = useState({
    status: initialStatus
  }),
      _useState6 = _slicedToArray(_useState5, 2),
      results = _useState6[0],
      setResults = _useState6[1];

  if (query != null && isIdle(results.status)) {
    setResults({
      status: STATUS_LOADING
    });
  }

  useEffect(function () {
    if (query == null) {
      return;
    }

    var setData = function setData(data) {
      return setResults({
        status: STATUS_SUCCESS,
        data: data
      });
    };

    var setError = function setError(error) {
      return setResults({
        status: STATUS_ERROR,
        error: error
      });
    };

    search({
      query: query,
      offset: offset,
      count: count
    }).then(setData, setError).done();
  }, [query, offset, count, search]);
  return results;
};