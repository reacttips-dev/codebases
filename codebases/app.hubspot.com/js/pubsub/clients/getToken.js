'use es6';

import noAuthHttp from '../../http/noAuthApiClient';
export var getToken = function getToken(_ref) {
  var sessionId = _ref.sessionId,
      hubspotUtk = _ref.hubspotUtk;
  return noAuthHttp.get('livechat-public/v1/pubsub/token/visitor', {
    query: {
      sessionId: sessionId,
      hubspotUtk: hubspotUtk
    }
  });
};