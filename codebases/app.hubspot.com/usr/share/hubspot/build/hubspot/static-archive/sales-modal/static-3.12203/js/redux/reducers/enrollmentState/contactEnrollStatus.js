'use es6';

import { Map as ImmutableMap } from 'immutable';
import omit from 'transmute/omit';
import { ENROLLMENT_STATE_INIT, ENROLLMENT_STATE_SINGLE_ENROLLMENT_SUCCEEDED, ENROLLMENT_STATE_REMOVE_CONTACTS, ENROLLMENT_STATE_BULK_ENROLLMENT_SUCCEEDED } from '../../actionTypes';
var initialState = ImmutableMap();
export default function contactEnrollStatus() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case ENROLLMENT_STATE_INIT:
      return action.payload.contacts.map(function () {
        return null;
      });

    case ENROLLMENT_STATE_SINGLE_ENROLLMENT_SUCCEEDED:
      return state.set(action.payload.contactId, 'SUCCEEDED');

    case ENROLLMENT_STATE_BULK_ENROLLMENT_SUCCEEDED:
      {
        var sequenceEnrollments = action.payload.sequenceEnrollments;
        return sequenceEnrollments.keySeq().reduce(function (acc, contactId) {
          return acc.set(contactId, 'SUCCEEDED');
        }, state);
      }

    case ENROLLMENT_STATE_REMOVE_CONTACTS:
      return omit(action.payload.contacts, state);

    default:
      return state;
  }
}