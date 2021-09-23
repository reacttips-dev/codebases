'use es6';

import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPinnedViewsFetchStatus } from '../selectors/pinnedViewsSelectors';
import { fetchPinnedViewsAction, fetchPinnedViewsSucceededAction } from '../actions/pinnedViewsActions';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { PENDING, UNINITIALIZED, FAILED } from '../../constants/RequestStatus';
import { useQuery, registerQuery } from 'data-fetching-client';
import { getPinnedViewDefinitions } from '../api/pinnedViewsAPI';
import { cacheViews } from '../../views/actions/viewsActions';
import keyBy from '../../../utils/keyBy';
import * as ViewIdMapping from '../../../crm_ui/views/ViewIdMapping';
import { useHasPinnedViewsBackendRedesignGate } from './useHasPinnedViewsBackendRedesignGate';
import { parseView } from '../../views/api/viewsAPI';
export var fetchPinnedViews = registerQuery({
  fieldName: 'pinnedViews',
  args: ['objectTypeId'],
  fetcher: getPinnedViewDefinitions
});
export var useFetchPinnedViews = function useFetchPinnedViews() {
  var dispatch = useDispatch();
  var objectTypeId = useSelectedObjectTypeId();
  var status = useSelector(getPinnedViewsFetchStatus);
  var hasBERedesignGate = useHasPinnedViewsBackendRedesignGate();
  var handlePinnedViewsFetchComplete = useCallback(function (_ref) {
    var pinnedViews = _ref.pinnedViews;
    // TODO: Move defaults to the BE so that we can treat them
    // like any other view
    // HACK: ViewIdMapping returns the id if there is no mapping for it.
    // We can only tell if there is a mapping by checking if the return
    // value is different from the input.
    var customPinnedViews = pinnedViews.results.filter(function (_ref2) {
      var id = _ref2.id;
      return ViewIdMapping.lookup(id) === id;
    }).map(parseView);
    dispatch(cacheViews({
      objectTypeId: objectTypeId,
      views: keyBy(function (_ref3) {
        var id = _ref3.id;
        return String(id);
      }, customPinnedViews)
    }));
    var pinnedViewIds = pinnedViews.results.map(function (_ref4) {
      var id = _ref4.id;
      return ViewIdMapping.lookup(id);
    });
    dispatch(fetchPinnedViewsSucceededAction(objectTypeId, pinnedViewIds));
  }, [dispatch, objectTypeId]);

  var _useQuery = useQuery(fetchPinnedViews, {
    skip: !hasBERedesignGate || status !== UNINITIALIZED,
    variables: {
      objectTypeId: objectTypeId
    },
    onCompleted: handlePinnedViewsFetchComplete
  }),
      loading = _useQuery.loading,
      error = _useQuery.error;

  useEffect(function () {
    if (!hasBERedesignGate && status === UNINITIALIZED) {
      dispatch(fetchPinnedViewsAction(objectTypeId));
    }
  }, [dispatch, hasBERedesignGate, objectTypeId, status]);

  if (loading) {
    return PENDING;
  }

  if (error) {
    return FAILED;
  }

  return status;
};