'use es6';

import { fetchViewCounts, fetchViewCountsByTypeId } from '../api/viewCountsAPI';
import { VIEW_COUNTS_FETCH_FAILED, VIEW_COUNTS_FETCH_STARTED, VIEW_COUNTS_FETCH_SUCCEEDED } from './viewCountsActionTypes';
export var fetchViewCountsAction = function fetchViewCountsAction(hasBERedesignGate) {
  return function (dispatch) {
    dispatch({
      type: VIEW_COUNTS_FETCH_STARTED
    });
    var fetchPromise = hasBERedesignGate ? fetchViewCountsByTypeId : fetchViewCounts;
    return fetchPromise().then(function (data) {
      dispatch({
        type: VIEW_COUNTS_FETCH_SUCCEEDED,
        payload: {
          data: data
        }
      });
    }).catch(function (error) {
      dispatch({
        type: VIEW_COUNTS_FETCH_FAILED
      });
      throw error;
    });
  };
};