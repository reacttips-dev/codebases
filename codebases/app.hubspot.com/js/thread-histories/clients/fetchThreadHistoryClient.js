'use es6';

import PortalIdParser from 'PortalIdParser';
import noAuthHttp from '../../http/noAuthApiClient';
export var fetchThreadHistoryClient = function fetchThreadHistoryClient(_ref) {
  var sessionId = _ref.sessionId,
      threadId = _ref.threadId,
      offsetTimestamp = _ref.offsetTimestamp,
      offsetOrdinal = _ref.offsetOrdinal;
  return noAuthHttp.get("livechat-public/v1/conversationhistory/visitor/" + threadId, {
    query: {
      sessionId: sessionId,
      offsetTimestamp: offsetTimestamp,
      offsetOrdinal: offsetOrdinal,
      portalId: PortalIdParser.get(),
      sortDirection: 'DESCENDING',
      expectedResponseType: 'WRAPPER_V2'
    }
  });
};