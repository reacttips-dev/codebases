'use es6';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setPinnedViewsAction } from '../actions/pinnedViewsActions';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
export var usePinnedViewsActions = function usePinnedViewsActions() {
  var dispatch = useDispatch();
  var objectTypeId = useSelectedObjectTypeId();
  var setPinnedViews = useCallback(function (ids) {
    return dispatch(setPinnedViewsAction({
      objectTypeId: objectTypeId,
      ids: ids
    }));
  }, [dispatch, objectTypeId]);
  return {
    setPinnedViews: setPinnedViews
  };
};