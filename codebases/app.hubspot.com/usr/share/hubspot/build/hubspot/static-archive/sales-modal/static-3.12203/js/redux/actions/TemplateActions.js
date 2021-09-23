'use es6';

import * as TemplatesApi from 'sales-modal/api/TemplatesApi';
import { isUngatedForMissingTokenTransformer as isUngatedForMissingTokenTransformerSelector } from 'sales-modal/redux/selectors/permissionSelectors';
export var renderAndInsertTemplate = function renderAndInsertTemplate() {
  return function (dispatch, getState) {
    var _getState = getState(),
        salesModalInterface = _getState.salesModalInterface,
        contentPayload = _getState.contentPayload,
        _getState$content = _getState.content,
        supplementalObjectType = _getState$content.supplementalObjectType,
        supplementalObjectId = _getState$content.supplementalObjectId;

    var isUngatedForMissingTokenTransformer = isUngatedForMissingTokenTransformerSelector(getState());

    if (!salesModalInterface) {
      return;
    }

    var id = contentPayload.get('contentId');
    var email = contentPayload.get('email');
    TemplatesApi.render({
      id: id,
      email: email,
      supplementalObjectType: supplementalObjectType,
      supplementalObjectId: supplementalObjectId,
      isUngatedForMissingTokenTransformer: isUngatedForMissingTokenTransformer
    }).then(function (payload) {
      var subject = payload.get('subject');
      var body = payload.get('html');
      salesModalInterface.insertTemplate(subject, body, id);
      salesModalInterface.closeModal();
    }).done();
  };
};