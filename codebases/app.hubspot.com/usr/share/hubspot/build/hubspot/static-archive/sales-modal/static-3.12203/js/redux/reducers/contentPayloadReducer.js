'use es6';

import { fromJS } from 'immutable';
import { SELECT_ITEM, RECEIVE_CONTACT, RECEIVE_DOCUMENT_LINK, RESET_MODAL } from '../actionTypes';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
var initialState = fromJS({
  firstName: null,
  lastName: null,
  email: null,
  contentId: null,
  contentType: null,
  docLink: null
});

var contentPayloadReducer = function contentPayloadReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case RECEIVE_CONTACT:
      return state.update(function (contentPayload) {
        var contactEmail = getProperty(action.payload, 'email');
        return contentPayload.merge(action.payload).set('email', contactEmail);
      });

    case RECEIVE_DOCUMENT_LINK:
      return state.set('docLink', action.payload.get('shortLink'));

    case SELECT_ITEM:
      return state.update(function (contentPayload) {
        return contentPayload.merge({
          contentId: action.payload.get('contentId'),
          contentType: action.payload.get('contentType')
        });
      });

    case RESET_MODAL:
      return state.merge({
        contentId: null,
        contentType: null,
        docLink: null
      });

    default:
      return state;
  }
};

export default contentPayloadReducer;