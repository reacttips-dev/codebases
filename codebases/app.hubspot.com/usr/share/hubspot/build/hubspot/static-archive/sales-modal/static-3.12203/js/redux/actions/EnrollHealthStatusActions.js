'use es6';

import * as SequencesApi from 'sales-modal/api/SequencesApi';
import Raven from 'Raven';
import partial from 'transmute/partial';
import { simpleAction } from 'sales-modal/utils/salesModalReduxUtils';
import { ENROLL_HEALTH_STATUS_FETCH_STARTED, ENROLL_HEALTH_STATUS_FETCH_SUCCEEDED, ENROLL_HEALTH_STATUS_FETCH_FAILED } from '../actionTypes';
export var fetchEnrollHealthStatusStarted = partial(simpleAction, ENROLL_HEALTH_STATUS_FETCH_STARTED);
export var fetchEnrollHealthStatusSucceeded = partial(simpleAction, ENROLL_HEALTH_STATUS_FETCH_SUCCEEDED);
export var fetchEnrollHealthStatusFailed = partial(simpleAction, ENROLL_HEALTH_STATUS_FETCH_FAILED);
export var fetchEnrollHealthStatus = function fetchEnrollHealthStatus() {
  return function (dispatch) {
    dispatch(fetchEnrollHealthStatusStarted());
    SequencesApi.fetchEnrollHealthStatus().then(function (payload) {
      return dispatch(fetchEnrollHealthStatusSucceeded(payload));
    }, function (err) {
      dispatch(fetchEnrollHealthStatusFailed());
      Raven.captureMessage('[sales-modal] Failed to fetch health status', {
        extra: {
          statusCode: err.status,
          statusText: err.statusText,
          responseText: err.responseText
        }
      });
    });
  };
};