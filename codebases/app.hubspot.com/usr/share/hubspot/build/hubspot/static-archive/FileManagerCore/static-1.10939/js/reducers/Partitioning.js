'use es6';

import Immutable from 'immutable';
import { CHANGE_FOLDER_PARTITIONING_FAILED, CHANGE_FOLDER_PARTITIONING_SUCCEEDED, CHANGE_FOLDER_PARTITIONING_ATTEMPTED } from '../actions/ActionTypes';
import { RequestStatus } from '../Constants';
var defaultState = Immutable.Map({
  status: RequestStatus.UNINITIALIZED
});
export default function Partitioning() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      status = action.status;

  switch (type) {
    case CHANGE_FOLDER_PARTITIONING_ATTEMPTED:
    case CHANGE_FOLDER_PARTITIONING_SUCCEEDED:
    case CHANGE_FOLDER_PARTITIONING_FAILED:
      return state.merge({
        status: status
      });

    default:
      return state;
  }
}