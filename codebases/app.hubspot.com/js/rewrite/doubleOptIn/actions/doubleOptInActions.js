'use es6';

import { fetchDoubleOptInSetting } from '../api/doubleOptInAPI';
import { FETCH_DOUBLE_OPT_IN_FAILED, FETCH_DOUBLE_OPT_IN_STARTED, FETCH_DOUBLE_OPT_IN_SUCCEEDED } from './doubleOptInActionTypes';
export var fetchDoubleOptInSettingAction = function fetchDoubleOptInSettingAction() {
  return function (dispatch) {
    dispatch({
      type: FETCH_DOUBLE_OPT_IN_STARTED
    });
    return fetchDoubleOptInSetting().then(function (data) {
      dispatch({
        type: FETCH_DOUBLE_OPT_IN_SUCCEEDED,
        payload: {
          data: data
        }
      });
      return data;
    }).catch(function (error) {
      dispatch({
        type: FETCH_DOUBLE_OPT_IN_FAILED
      });
      throw error;
    });
  };
};