'use es6';

import { fromJS, Map as ImmutableMap } from 'immutable';
import { CONTACT_PROPERTIES_FETCH_SUCCEEDED, COMPANY_PROPERTIES_FETCH_SUCCEEDED, DEAL_PROPERTIES_FETCH_SUCCEEDED, TICKET_PROPERTIES_FETCH_SUCCEEDED, SENDER_PROPERTIES_INIT } from 'sales-modal/redux/actionTypes';
import getSenderProperties from 'draft-plugins/utils/getSenderProperties';
import { flattenPropertyList } from 'draft-plugins/utils/propertyUtils';
var initialState = fromJS({
  contactProperties: ImmutableMap(),
  companyProperties: ImmutableMap(),
  dealProperties: ImmutableMap(),
  ticketProperties: ImmutableMap(),
  senderProperties: ImmutableMap(),
  placeholderProperties: ImmutableMap()
});
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case CONTACT_PROPERTIES_FETCH_SUCCEEDED:
      return state.set('contactProperties', flattenPropertyList(action.payload));

    case COMPANY_PROPERTIES_FETCH_SUCCEEDED:
      return state.set('companyProperties', flattenPropertyList(action.payload));

    case DEAL_PROPERTIES_FETCH_SUCCEEDED:
      return state.set('dealProperties', flattenPropertyList(action.payload));

    case TICKET_PROPERTIES_FETCH_SUCCEEDED:
      return state.set('ticketProperties', flattenPropertyList(action.payload));

    case SENDER_PROPERTIES_INIT:
      return state.set('senderProperties', flattenPropertyList(getSenderProperties()));

    default:
      return state;
  }
});