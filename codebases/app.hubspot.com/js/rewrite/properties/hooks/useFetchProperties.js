'use es6';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPropertiesFetchStatus } from '../selectors/propertiesSelectors';
import { UNINITIALIZED } from '../../constants/RequestStatus';
import { fetchPropertiesAction } from '../actions/propertiesActions';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
export var useFetchProperties = function useFetchProperties() {
  var dispatch = useDispatch();
  var objectTypeId = useSelectedObjectTypeId();
  var status = useSelector(getPropertiesFetchStatus);
  useEffect(function () {
    if (status === UNINITIALIZED) {
      dispatch(fetchPropertiesAction(objectTypeId));
    }
  }, [dispatch, objectTypeId, status]);
  return status;
};