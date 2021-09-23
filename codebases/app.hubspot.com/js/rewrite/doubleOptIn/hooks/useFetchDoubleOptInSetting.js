'use es6';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { UNINITIALIZED } from '../../constants/RequestStatus';
import { fetchDoubleOptInSettingAction } from '../actions/doubleOptInActions';
import { useDoubleOptInFetchStatus } from './useDoubleOptInFetchStatus';
export var useFetchDoubleOptInSetting = function useFetchDoubleOptInSetting() {
  var dispatch = useDispatch();
  var status = useDoubleOptInFetchStatus();
  useEffect(function () {
    if (status === UNINITIALIZED) {
      dispatch(fetchDoubleOptInSettingAction());
    }
  }, [dispatch, status]);
  return status;
};