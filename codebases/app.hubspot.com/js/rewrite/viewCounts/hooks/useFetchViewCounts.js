'use es6';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UNINITIALIZED } from '../../constants/RequestStatus';
import { useHasCreateViewBERedesignGate } from '../../views/hooks/useHasCreateViewBERedesignGate';
import { fetchViewCountsAction } from '../actions/viewCountsActions';
import { getViewCountsFetchStatus } from '../selectors/viewCountsSelectors';
export var useFetchViewCounts = function useFetchViewCounts() {
  var hasBERedesignGate = useHasCreateViewBERedesignGate();
  var dispatch = useDispatch();
  var status = useSelector(getViewCountsFetchStatus);
  useEffect(function () {
    if (status === UNINITIALIZED) {
      dispatch(fetchViewCountsAction(hasBERedesignGate));
    }
  }, [dispatch, hasBERedesignGate, status]);
  return status;
};