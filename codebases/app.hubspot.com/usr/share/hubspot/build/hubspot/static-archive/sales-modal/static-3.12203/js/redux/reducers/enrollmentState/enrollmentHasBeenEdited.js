'use es6';

import omit from 'transmute/omit';
import { ENROLLMENT_STATE_INIT, ENROLLMENT_STATE_REMOVE_CONTACTS, ENROLLMENT_STATE_ENROLLMENT_INIT } from '../../actionTypes';
import { SET_TIMEZONE, SET_STARTING_STEP_ORDER, SET_STEP_DELAY, SET_FIRST_SEND_TYPE, SET_TIME_OF_DAY, TOGGLE_STEP_DEPENDENCY, SET_UNSUBSCRIBE_LINKS, SET_MERGE_TAGS, SET_RECOMMENDED_SEND_TIMES, APPLY_ENROLLMENT_SETTINGS, SET_STEP_METADATA } from '../../enrollmentEditActionTypes';
var initialState = null;
export default function enrollmentHasBeenEdited() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case ENROLLMENT_STATE_INIT:
      return action.payload.contacts.map(function () {
        return null;
      });

    case ENROLLMENT_STATE_ENROLLMENT_INIT:
      return action.payload.sequenceEnrollments.reduce(function (acc, _, contactId) {
        return acc.set(contactId, false);
      }, state);

    case SET_UNSUBSCRIBE_LINKS:
    case SET_MERGE_TAGS:
    case SET_RECOMMENDED_SEND_TIMES:
    case SET_STEP_METADATA:
      return state.set(action.payload.selectedContact, true);

    case SET_TIMEZONE:
    case SET_STARTING_STEP_ORDER:
    case SET_STEP_DELAY:
    case SET_FIRST_SEND_TYPE:
    case SET_TIME_OF_DAY:
    case TOGGLE_STEP_DEPENDENCY:
    case APPLY_ENROLLMENT_SETTINGS:
      return state.map(function () {
        return true;
      });

    case ENROLLMENT_STATE_REMOVE_CONTACTS:
      return omit(action.payload.contacts, state);

    default:
      return state;
  }
}