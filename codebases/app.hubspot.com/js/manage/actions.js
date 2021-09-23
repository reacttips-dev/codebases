'use es6';

import { makeGetManagePath } from './selectors';
import { push } from 'react-router-redux';
export var goToManageUrl = function goToManageUrl(statusType, broadcastGuid) {
  return function (dispatch, getState) {
    return dispatch(push(makeGetManagePath(getState())(statusType, broadcastGuid)));
  };
};