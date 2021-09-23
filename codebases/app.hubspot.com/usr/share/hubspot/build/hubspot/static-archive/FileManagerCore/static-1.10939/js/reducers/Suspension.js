'use es6';

import { Map as ImmutableMap } from 'immutable';
import { FETCH_SUSPENSION_STATE_ATTEMPTED, FETCH_SUSPENSION_STATE_FAILED, FETCH_SUSPENSION_STATE_SUCCEEDED } from '../actions/ActionTypes';
import { RequestStatus } from '../Constants';
import AppealStates from '../enums/SuspensionAppealStates';
var defaultState = ImmutableMap({
  suspended: false,
  canAppeal: false,
  appealState: AppealStates.UNINITIATED,
  fetchStatus: RequestStatus.UNINITIALIZED
});
export default function Suspension() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type;

  switch (type) {
    case FETCH_SUSPENSION_STATE_ATTEMPTED:
      return state.set('fetchStatus', RequestStatus.PENDING);

    case FETCH_SUSPENSION_STATE_SUCCEEDED:
      return action.data.set('fetchStatus', RequestStatus.SUCCEEDED);

    case FETCH_SUSPENSION_STATE_FAILED:
      return state.set('fetchStatus', RequestStatus.SUCCEEDED);

    default:
      return state;
  }
}