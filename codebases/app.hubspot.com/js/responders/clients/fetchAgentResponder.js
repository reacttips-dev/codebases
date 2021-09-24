'use es6';

import PortalIdParser from 'PortalIdParser';
import noAuthHttp from '../../http/noAuthApiClient';
export function fetchAgentResponder(_ref) {
  var senderId = _ref.senderId,
      agentType = _ref.agentType,
      sessionId = _ref.sessionId,
      threadId = _ref.threadId;
  var portalId = PortalIdParser.get();
  return noAuthHttp.get("livechat-public/v1/responder/" + senderId, {
    query: {
      agentType: agentType,
      portalId: portalId,
      sessionId: sessionId,
      threadId: threadId
    }
  });
}