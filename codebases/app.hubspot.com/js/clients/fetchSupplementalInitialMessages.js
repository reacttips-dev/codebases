'use es6';

import noAuthHttp from '../http/noAuthApiClient';
export function fetchSupplementalInitialMessages(_ref) {
  var botId = _ref.botId,
      sessionId = _ref.sessionId,
      hubspotUtk = _ref.hubspotUtk;
  return noAuthHttp.getWithResponse("livechat-public/v1/bots/public/bot/" + botId + "/welcomeMessages", {
    query: {
      sessionId: sessionId,
      hubspotUtk: hubspotUtk
    }
  });
}