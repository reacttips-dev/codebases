'use es6';

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryParams } from '../../../router/useQueryParams';
import { setLastAccessedView, updateUIState } from '../../../crm_ui/grid/utils/gridStateLocalStorage';
export var useSyncRouterValuesToCache = function useSyncRouterValuesToCache() {
  var _useParams = useParams(),
      objectTypeId = _useParams.objectTypeId,
      viewId = _useParams.viewId;

  var _useQueryParams = useQueryParams(),
      query = _useQueryParams.query;

  useEffect(function () {
    setLastAccessedView({
      objectType: objectTypeId,
      viewId: viewId
    });
    updateUIState({
      objectType: objectTypeId,
      key: 'query',
      value: query
    });
  }, [objectTypeId, query, viewId]);
};