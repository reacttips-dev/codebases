'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useState, useEffect } from 'react';
import { FAILED, PENDING, SUCCEEDED, UNINITIALIZED } from '../../constants/RequestStatus';
import { hydrateSearchQuery } from '../api/hydrateSearchQuery';
import { useSearchQuery } from './useSearchQuery';
export var useHydratedSearchQuery = function useHydratedSearchQuery() {
  var query = useSearchQuery();

  var _useState = useState({
    status: UNINITIALIZED,
    query: null
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setHydratedQueryState = _useState2[1];

  useEffect(function () {
    setHydratedQueryState({
      status: PENDING,
      query: null
    });
    hydrateSearchQuery(query).then(function (hydratedQuery) {
      return setHydratedQueryState({
        status: SUCCEEDED,
        query: hydratedQuery
      });
    }).catch(function () {
      return setHydratedQueryState({
        status: FAILED,
        query: null
      });
    });
  }, [query]);
  return state;
};