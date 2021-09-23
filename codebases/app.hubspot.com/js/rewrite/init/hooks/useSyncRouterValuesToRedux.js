'use es6';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { syncRouterValuesAction } from '../actions/initActions';
import { useQueryParams } from '../../../router/useQueryParams';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { useCurrentViewId } from '../../views/hooks/useCurrentViewId';
import { useCurrentPageType } from '../../views/hooks/useCurrentPageType';
import { useSearchTerm } from '../../search/hooks/useSearchTerm';
import { syncSearchTermAction } from '../../search/actions/searchActions';
export var useSyncRouterValuesToRedux = function useSyncRouterValuesToRedux() {
  var dispatch = useDispatch();

  var _useParams = useParams(),
      objectTypeId = _useParams.objectTypeId,
      viewId = _useParams.viewId,
      pageType = _useParams.pageType;

  var _useQueryParams = useQueryParams(),
      query = _useQueryParams.query;

  var syncedTypeId = useSelectedObjectTypeId();
  var syncedViewId = useCurrentViewId();
  var syncedPageType = useCurrentPageType();
  var syncedSearchTerm = useSearchTerm();
  var shouldSyncPathParams = syncedTypeId !== objectTypeId || syncedViewId !== viewId || syncedPageType !== pageType;
  var shouldSyncSearchTerm = syncedSearchTerm !== query;
  useEffect(function () {
    if (shouldSyncPathParams) {
      dispatch(syncRouterValuesAction({
        objectTypeId: objectTypeId,
        viewId: viewId,
        pageType: pageType
      }));
    }

    if (shouldSyncSearchTerm) {
      dispatch(syncSearchTermAction(query));
    }
  }, [dispatch, objectTypeId, pageType, query, shouldSyncPathParams, shouldSyncSearchTerm, viewId]); // This is the minimum data that is required to begin the init flow

  return syncedTypeId === objectTypeId;
};