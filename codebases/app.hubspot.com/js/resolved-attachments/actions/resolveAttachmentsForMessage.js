'use es6';

import { fileAttachmentIdsInMessage } from 'conversations-message-history/common-message-format/operators/fileAttachmentIdsInMessage';
import { getSessionId } from '../../selectors/widgetDataSelectors/getSessionId';
import { resolveAttachments } from './resolveAttachments';
export var resolveAttachmentsForMessage = function resolveAttachmentsForMessage(_ref) {
  var message = _ref.message,
      threadId = _ref.threadId;
  return function (dispatch, getState) {
    var fileIds = fileAttachmentIdsInMessage(message);

    if (fileIds.size) {
      var sessionId = getSessionId(getState());
      dispatch(resolveAttachments({
        fileIds: fileIds,
        sessionId: sessionId,
        threadId: threadId
      }));
    }
  };
};