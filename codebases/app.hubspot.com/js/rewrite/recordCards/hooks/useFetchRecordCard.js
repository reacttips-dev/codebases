'use es6';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import get from 'transmute/get';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { UNINITIALIZED } from '../../constants/RequestStatus';
import { getRecordCardAction } from '../actions/recordCardsActions';
import { getRecordCardsStatusesForCurrentType } from '../selectors/recordCardsSelectors';
export var useFetchRecordCard = function useFetchRecordCard(location) {
  var skip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var dispatch = useDispatch();
  var objectTypeId = useSelectedObjectTypeId();
  var statuses = useSelector(getRecordCardsStatusesForCurrentType);
  var status = get(location, statuses) || UNINITIALIZED;
  useEffect(function () {
    if (status === UNINITIALIZED && !skip) {
      dispatch(getRecordCardAction({
        objectTypeId: objectTypeId,
        location: location
      }));
    }
  }, [dispatch, status, objectTypeId, location, skip]);
  return status;
};