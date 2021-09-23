'use es6';

import { FAILED, PENDING, SUCCEEDED, UNINITIALIZED } from '../../constants/RequestStatus';
import { FETCH_TEAMS_STARTED, FETCH_TEAMS_SUCCEEDED, FETCH_TEAMS_FAILED } from '../actions/teamsActionTypes';
var initialState = {
  status: UNINITIALIZED,
  teams: {}
};
export var teamsReducer = function teamsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case FETCH_TEAMS_STARTED:
      {
        return Object.assign({}, state, {
          status: PENDING
        });
      }

    case FETCH_TEAMS_SUCCEEDED:
      {
        var teams = action.payload.teams;
        var teamsById = teams.reduce(function (teamsMap, team) {
          teamsMap[team.id] = team;
          return teamsMap;
        }, {});
        return Object.assign({}, state, {
          teams: teamsById,
          status: SUCCEEDED
        });
      }

    case FETCH_TEAMS_FAILED:
      {
        return Object.assign({}, state, {
          status: FAILED
        });
      }

    default:
      return state;
  }
};