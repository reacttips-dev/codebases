'use es6';

import { OrderedMap } from 'immutable';
import omit from 'transmute/omit';
import * as ActionTypes from '../../actionTypes';
var initialState = {
  contactMap: OrderedMap(),
  selectedContact: null
};
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case ActionTypes.ENROLLMENT_STATE_INIT:
      return {
        contactMap: action.payload.contacts,
        selectedContact: action.payload.selectedContact
      };

    case ActionTypes.ENROLLMENT_STATE_SELECT_CONTACT:
      return Object.assign({}, state, {
        selectedContact: action.payload
      });

    case ActionTypes.ENROLLMENT_STATE_SINGLE_ENROLLMENT_SUCCEEDED:
    case ActionTypes.ENROLLMENT_STATE_BULK_ENROLLMENT_SUCCEEDED:
      return Object.assign({}, state, {
        selectedContact: action.payload.nextContactId
      });

    case ActionTypes.ENROLLMENT_STATE_REMOVE_CONTACTS:
      {
        var contactsWithoutRemoved = omit(action.payload.contacts, state.contactMap);
        return {
          contactMap: contactsWithoutRemoved,
          selectedContact: action.payload.nextContactId || state.selectedContact
        };
      }

    case ActionTypes.ENROLLMENT_STATE_CONTACTS_REORDERED:
      {
        return Object.assign({}, state, {
          contactMap: action.payload.contacts
        });
      }

    default:
      return state;
  }
});