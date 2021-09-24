'use es6';

import * as TeamsApi from '../api/Teams';
import { reportError } from '../utils/logging';
import { FETCH_TEAMS_ATTEMPTED, FETCH_TEAMS_FAILED, FETCH_TEAMS_SUCCEEDED } from './ActionTypes';
export var fetchTeams = function fetchTeams() {
  return function (dispatch) {
    dispatch({
      type: FETCH_TEAMS_ATTEMPTED
    });
    return TeamsApi.fetchTeams().then(function (data) {
      return dispatch({
        type: FETCH_TEAMS_SUCCEEDED,
        data: data
      });
    }).catch(function (err) {
      reportError(err, {
        action: FETCH_TEAMS_FAILED
      });
      dispatch({
        type: FETCH_TEAMS_FAILED
      });
      throw err;
    });
  };
};