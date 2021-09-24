'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { SEQUENCE_NUM_ACTIVE_CONTACTS_FOR_SEQUENCE_ID_FETCH_SUCCESS, SEQUENCE_PAUSE_ENROLLMENTS_BY_SEQUENCE_ID_SUCCESS, SEQUENCE_RESUME_ENROLLMENTS_BY_SEQUENCE_ID_SUCCESS, SEQUENCE_PAUSE_ALL_ENROLLMENTS_SUCCESS, SEQUENCE_RESUME_ALL_ENROLLMENTS_SUCCESS } from 'SequencesUI/constants/SequenceActionTypes';
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SEQUENCE_NUM_ACTIVE_CONTACTS_FOR_SEQUENCE_ID_FETCH_SUCCESS:
      {
        var sequenceId = action.payload.sequenceId;
        var contacts = action.payload.contacts;
        return Object.assign({}, state, _defineProperty({}, sequenceId, contacts.total));
      }

    case SEQUENCE_PAUSE_ENROLLMENTS_BY_SEQUENCE_ID_SUCCESS:
      {
        var _sequenceId = action.payload.sequenceId;
        return Object.assign({}, state, _defineProperty({}, _sequenceId, 0));
      }

    case SEQUENCE_PAUSE_ALL_ENROLLMENTS_SUCCESS:
      {
        if (state) {
          var newState = {};
          Object.keys(state).forEach(function (key) {
            newState[key] = 0;
          });
          return newState;
        }

        return state;
      }

    case SEQUENCE_RESUME_ENROLLMENTS_BY_SEQUENCE_ID_SUCCESS:
      {
        var _sequenceId2 = action.payload.sequenceId;
        var numNewlyResumedContacts = action.payload.numContacts;
        return Object.assign({}, state, _defineProperty({}, _sequenceId2, state[_sequenceId2] + numNewlyResumedContacts));
      }

    case SEQUENCE_RESUME_ALL_ENROLLMENTS_SUCCESS:
      {
        if (state) {
          var _newState = {};
          Object.keys(state).forEach(function (key) {
            _newState[key] = null;
          });
          return _newState;
        }

        return state;
      }

    default:
      return state;
  }
});