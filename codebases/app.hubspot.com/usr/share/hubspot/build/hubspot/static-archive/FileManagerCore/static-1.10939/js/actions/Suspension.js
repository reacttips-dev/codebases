'use es6';

import { Map as ImmutableMap } from 'immutable';
import { FETCH_SUSPENSION_STATE_ATTEMPTED, FETCH_SUSPENSION_STATE_SUCCEEDED, FETCH_SUSPENSION_STATE_FAILED } from './ActionTypes';
import { requestSuspensionStatus } from '../api/Suspension';
import { reportError } from '../utils/logging';
var suspensionStatusPromise;

var buildSuspensionStateFromResponse = function buildSuspensionStateFromResponse(data) {
  return ImmutableMap({
    suspended: data.suspended,
    canAppeal: data.canAppeal,
    appealState: data.appealState
  });
};

export var fetchSuspensionStatus = function fetchSuspensionStatus() {
  return function (dispatch) {
    if (suspensionStatusPromise) {
      return suspensionStatusPromise;
    }

    dispatch({
      type: FETCH_SUSPENSION_STATE_ATTEMPTED
    });
    suspensionStatusPromise = requestSuspensionStatus().then(function (data) {
      data = buildSuspensionStateFromResponse(data);
      dispatch({
        type: FETCH_SUSPENSION_STATE_SUCCEEDED,
        data: data
      });
    }).catch(function (err) {
      reportError(err, {
        action: FETCH_SUSPENSION_STATE_FAILED
      });
      dispatch({
        type: FETCH_SUSPENSION_STATE_FAILED
      });
    });
    return suspensionStatusPromise;
  };
};