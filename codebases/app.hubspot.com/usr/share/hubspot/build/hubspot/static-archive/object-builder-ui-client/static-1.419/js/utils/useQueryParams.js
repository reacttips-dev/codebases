'use es6';

import * as params from 'hub-http/helpers/params';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
export function useQueryParams() {
  var _useLocation = useLocation(),
      search = _useLocation.search;

  var queryParams = useMemo(function () {
    return params.parse(search.substring(1));
  }, [search]);
  return queryParams;
}