'use es6';

import { simpleAction } from 'sales-modal/utils/salesModalReduxUtils';
import * as DocumentsApi from 'sales-modal/api/DocumentsApi';
import { RECEIVE_DOCUMENT_LINK } from '../actionTypes';

var receiveDocumentLink = function receiveDocumentLink(payload) {
  return simpleAction(RECEIVE_DOCUMENT_LINK, payload);
};

export var createAndInsertDocumentLink = function createAndInsertDocumentLink() {
  return function (dispatch, getState) {
    var _getState = getState(),
        salesModalInterface = _getState.salesModalInterface,
        contentPayload = _getState.contentPayload;

    if (!salesModalInterface) {
      return null;
    }

    var id = contentPayload.get('contentId');

    if (contentPayload.get('docLink') === null) {
      return DocumentsApi.fetchLink(id, {
        skipForm: getState().ui.get('docSkipForm'),
        sharedWith: getState().contentPayload.get('email')
      }).then(function (documentLink) {
        dispatch(receiveDocumentLink(documentLink));
        var name = documentLink.get('name');
        var shortLink = documentLink.get('shortLink');
        salesModalInterface.insertLink(name, shortLink);
        salesModalInterface.closeModal();
      }).done();
    }

    return null;
  };
};