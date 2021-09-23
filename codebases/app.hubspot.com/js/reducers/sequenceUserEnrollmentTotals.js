'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { SEQUENCE_NUM_ALL_ACTIVE_CONTACTS_FETCH_SUCCESS, SEQUENCE_NUM_ALL_PAUSED_CONTACTS_FETCH_SUCCESS, SEQUENCE_PAUSE_ENROLLMENTS_BY_SEQUENCE_ID_SUCCESS, SEQUENCE_RESUME_ENROLLMENTS_BY_SEQUENCE_ID_SUCCESS, SEQUENCE_PAUSE_ALL_ENROLLMENTS_SUCCESS, SEQUENCE_RESUME_ALL_ENROLLMENTS_SUCCESS } from 'SequencesUI/constants/SequenceActionTypes';
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SEQUENCE_NUM_ALL_ACTIVE_CONTACTS_FETCH_SUCCESS:
      {
        return Object.assign({}, state, {
          active: action.payload.contacts.total
        });
      }

    case SEQUENCE_NUM_ALL_PAUSED_CONTACTS_FETCH_SUCCESS:
      {
        return Object.assign({}, state, {
          paused: action.payload.contacts.total
        });
      }

    case SEQUENCE_PAUSE_ALL_ENROLLMENTS_SUCCESS:
      {
        var numNewlyPausedContacts = action.payload.numContacts;
        return Object.assign({}, state, {
          paused: state['paused'] + numNewlyPausedContacts,
          active: 0
        });
      }

    case SEQUENCE_RESUME_ALL_ENROLLMENTS_SUCCESS:
      {
        var _Object$assign;

        var numNewlyResumedContacts = action.payload.numContacts;
        return Object.assign({}, state, (_Object$assign = {}, _defineProperty(_Object$assign, 'paused', 0), _defineProperty(_Object$assign, 'active', state['active'] + numNewlyResumedContacts), _Object$assign));
      }

    case SEQUENCE_PAUSE_ENROLLMENTS_BY_SEQUENCE_ID_SUCCESS:
      {
        var _numNewlyPausedContacts = action.payload.numContacts;

        if (state) {
          return Object.assign({}, state, {
            paused: state['paused'] + _numNewlyPausedContacts,
            active: state['active'] - _numNewlyPausedContacts
          });
        } else {
          return state;
        }
      }

    case SEQUENCE_RESUME_ENROLLMENTS_BY_SEQUENCE_ID_SUCCESS:
      {
        var _numNewlyResumedContacts = action.payload.numContacts;

        if (state) {
          return Object.assign({}, state, {
            paused: state['paused'] - _numNewlyResumedContacts,
            active: state['active'] + _numNewlyResumedContacts
          });
        } else {
          return state;
        }
      }

    default:
      return state;
  }
});