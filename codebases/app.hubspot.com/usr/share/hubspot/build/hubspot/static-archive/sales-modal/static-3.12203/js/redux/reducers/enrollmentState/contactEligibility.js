'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { fromJS } from 'immutable';
import omit from 'transmute/omit';
import { ENROLLMENT_STATE_INIT, ENROLLMENT_STATE_REMOVE_CONTACTS } from '../../actionTypes';
import { PRIMARY_SEQUENCE_ID } from 'sales-modal/constants/BulkEnrollConstants';
import { OK } from 'sales-modal/constants/SubscriptionStatusTypes';
var initialState = fromJS(_defineProperty({}, PRIMARY_SEQUENCE_ID, {
  errorType: null,
  status: OK,
  metadata: {
    eligibilityErrorTypeByExecuteTime: {},
    salesSubscriptionStatus: null,
    activeEnrollment: null,
    cannotCommunicate: false
  }
}));
export default function contactEligibility() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case ENROLLMENT_STATE_INIT:
      return state.merge(action.payload.eligibilityMap);

    case ENROLLMENT_STATE_REMOVE_CONTACTS:
      return omit(action.payload.contacts, state);

    default:
      return state;
  }
}