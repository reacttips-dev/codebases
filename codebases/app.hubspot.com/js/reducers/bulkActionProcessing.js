'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { combineReducers } from 'redux';
import { SEQUENCE_ENROLLMENT_POLLING_RESOLVED, SEQUENCE_PAUSE_ALL_ENROLLMENTS_SUCCESS, SEQUENCE_PAUSE_ENROLLMENTS_BY_SEQUENCE_ID_SUCCESS, SEQUENCE_RESUME_ALL_ENROLLMENTS_SUCCESS, SEQUENCE_RESUME_ENROLLMENTS_BY_SEQUENCE_ID_SUCCESS } from '../constants/SequenceActionTypes';

function actionableIds() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  switch (action.type) {
    case SEQUENCE_PAUSE_ENROLLMENTS_BY_SEQUENCE_ID_SUCCESS:
    case SEQUENCE_PAUSE_ALL_ENROLLMENTS_SUCCESS:
    case SEQUENCE_RESUME_ENROLLMENTS_BY_SEQUENCE_ID_SUCCESS:
    case SEQUENCE_RESUME_ALL_ENROLLMENTS_SUCCESS:
      return [].concat(_toConsumableArray(state), _toConsumableArray(action.payload.actionableIds.map(function (i) {
        return i.toString();
      })));

    case SEQUENCE_ENROLLMENT_POLLING_RESOLVED:
      return state.filter(function (id) {
        return action.payload.indexOf(id) === -1;
      });

    default:
  }

  return state;
}

export default combineReducers({
  actionableIds: actionableIds
});