'use es6';

import noAuthHttp from '../../http/noAuthApiClient';
var RESOLVE_ATTACHMENT_PATH = 'livechat-public/v1/attachment/resolve/thread';
export var resolveAttachmentsClient = function resolveAttachmentsClient() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      sessionId = _ref.sessionId,
      threadId = _ref.threadId,
      fileIds = _ref.fileIds;

  return noAuthHttp.get(RESOLVE_ATTACHMENT_PATH + "/" + threadId, {
    query: {
      fileId: fileIds.toArray(),
      sessionId: sessionId
    }
  });
};