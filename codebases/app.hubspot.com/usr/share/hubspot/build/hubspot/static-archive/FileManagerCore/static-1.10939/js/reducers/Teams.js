'use es6';

import Immutable from 'immutable';
import { FETCH_TEAMS_FAILED, FETCH_TEAMS_ATTEMPTED, FETCH_TEAMS_SUCCEEDED } from '../actions/ActionTypes';
import { RequestStatus } from '../Constants';
export default function Teams() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Immutable.Map({
    status: RequestStatus.UNINITIALIZED,
    teams: Immutable.Map()
  });
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      data = action.data;

  switch (type) {
    case FETCH_TEAMS_SUCCEEDED:
      return state.merge({
        status: RequestStatus.SUCCEEDED,
        teams: Immutable.Map(data.map(function (team) {
          return [team.get('id'), team];
        }))
      });

    case FETCH_TEAMS_ATTEMPTED:
      return state.merge({
        status: RequestStatus.PENDING
      });

    case FETCH_TEAMS_FAILED:
      return state.merge({
        status: RequestStatus.FAILED
      });

    default:
      return state;
  }
}