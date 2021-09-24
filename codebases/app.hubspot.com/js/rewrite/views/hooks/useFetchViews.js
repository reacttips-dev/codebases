'use es6';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getViewsFetchStatus } from '../selectors/viewsSelectors';
import { getViewsAction } from '../actions/viewsActions';
import { UNINITIALIZED } from '../../constants/RequestStatus';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
export var useFetchViews = function useFetchViews() {
  var dispatch = useDispatch();
  var objectTypeId = useSelectedObjectTypeId();
  var status = useSelector(getViewsFetchStatus);
  useEffect(function () {
    if (status === UNINITIALIZED) {
      dispatch(getViewsAction(objectTypeId));
    }
  }, [dispatch, objectTypeId, status]);
  return status;
};