'use es6';

import PortalIdParser from 'PortalIdParser';
import noAuthHttp from '../../http/noAuthApiClient';
var LIVECHAT_PUBLIC_API_PREFIX = 'livechat-public/v1';
export function markMessageReadByVisitor(_ref) {
  var threadId = _ref.threadId,
      sessionId = _ref.sessionId,
      messageId = _ref.messageId;
  return noAuthHttp.post(LIVECHAT_PUBLIC_API_PREFIX + "/visitorReadThread/thread/" + threadId + "/message/" + messageId, {
    query: {
      portalId: PortalIdParser.get(),
      sessionId: sessionId
    }
  });
}