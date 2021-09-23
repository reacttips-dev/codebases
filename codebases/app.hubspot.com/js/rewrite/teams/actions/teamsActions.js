'use es6';

import { FETCH_TEAMS_STARTED, FETCH_TEAMS_SUCCEEDED, FETCH_TEAMS_FAILED } from './teamsActionTypes';
import { fetchTeams } from '../api/teamsAPI';
export var getTeamsAction = function getTeamsAction() {
  return function (dispatch) {
    dispatch({
      type: FETCH_TEAMS_STARTED
    });
    return fetchTeams().then(function (teams) {
      return dispatch({
        type: FETCH_TEAMS_SUCCEEDED,
        payload: {
          teams: teams
        }
      });
    }).catch(function (error) {
      dispatch({
        type: FETCH_TEAMS_FAILED,
        payload: {
          error: error
        }
      });
      throw error;
    });
  };
};