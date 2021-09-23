'use es6';

import identity from 'transmute/identity';
import { createAction } from 'flux-actions';
import * as EnrollHealthStatusApi from '../api/EnrollHealthStatusApi';
import * as EnrollHealthStatusActionTypes from '../constants/EnrollHealthStatusActionTypes';
var fetchEnrollHealthStatusSucceeded = createAction(EnrollHealthStatusActionTypes.FETCH_ENROLL_HEALTH_STATUS_SUCCEEDED, identity);
export var fetchEnrollHealthStatus = function fetchEnrollHealthStatus() {
  return function (dispatch) {
    EnrollHealthStatusApi.fetch().then(function (response) {
      return dispatch(fetchEnrollHealthStatusSucceeded(response));
    });
  };
};