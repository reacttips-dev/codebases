'use es6';

import noAuthHttp from '../../http/noAuthApiClient';
var LIVECHAT_PUBLIC_API_PREFIX = 'livechat-public/v1';
export function fetchVisitorThreads(_ref) {
  var sessionId = _ref.sessionId;
  return noAuthHttp.get(LIVECHAT_PUBLIC_API_PREFIX + "/thread/visitor/recent", {
    query: {
      sessionId: sessionId
    }
  }).then(function (threads) {
    return threads.map(function (thread) {
      if (thread.responder) {
        thread.assignedAgentId = thread.responder.userId;
      } else {
        thread.assignedAgentId = null;
      }

      thread.channelDetails = thread.channel;
      delete thread.channel; // TODO: remove this once everyone is ungated and we have switched the FE over to use the boolean instead of a number

      thread.unseenCount = thread.hasUnreadMessages ? 1 : 0;
      return thread;
    });
  });
}