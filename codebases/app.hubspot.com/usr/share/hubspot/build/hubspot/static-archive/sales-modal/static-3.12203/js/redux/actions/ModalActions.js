'use es6';

import { simpleAction } from 'sales-modal/utils/salesModalReduxUtils';
import * as ContactApi from 'sales-modal/api/ContactApi';
import * as ContentApi from 'sales-modal/api/ContentApi';
import { renderAndInsertTemplate } from './TemplateActions';
import { createAndInsertDocumentLink } from './DocumentsActions';
import { SELECT_ITEM, TOGGLE_SKIP_FORM, RECEIVE_CONTACT, RESET_MODAL } from '../actionTypes';
import SearchContentTypes from 'SalesContentIndexUI/data/constants/SearchContentTypes';
export var toggleSkipForm = function toggleSkipForm(payload) {
  return simpleAction(TOGGLE_SKIP_FORM, payload);
};
export var selectItem = function selectItem(payload) {
  return function (dispatch) {
    dispatch(simpleAction(SELECT_ITEM, payload));
    ContentApi.updateUsage({
      contentId: payload.get('contentId'),
      contentType: payload.get('contentType')
    });

    switch (payload.get('contentType')) {
      case SearchContentTypes.TEMPLATE:
        return dispatch(renderAndInsertTemplate(payload));

      case SearchContentTypes.DOCUMENT:
        return dispatch(createAndInsertDocumentLink(payload));

      case SearchContentTypes.SEQUENCE:
        return null;

      default:
        return null;
    }
  };
};
export function resetModal(payload) {
  return simpleAction(RESET_MODAL, payload);
}

var receiveContact = function receiveContact(payload) {
  return simpleAction(RECEIVE_CONTACT, payload);
};

export var fetchContact = function fetchContact(contactId) {
  return function (dispatch) {
    return ContactApi.fetchContact(contactId).then(function (payload) {
      dispatch(receiveContact(payload));
    }).catch(function () {
      return null;
    }).done();
  };
};