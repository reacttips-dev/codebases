import http from 'hub-http/clients/apiClient';
import Token from '../records/token/Token';
var TWILIO_URL_PREFIX = 'twilio/v1';
export function refreshBrowserTokenClient(_ref) {
  var source = _ref.source,
      _ref$isUsingTwilioCon = _ref.isUsingTwilioConnect,
      isUsingTwilioConnect = _ref$isUsingTwilioCon === void 0 ? false : _ref$isUsingTwilioCon;

  if (source == null) {
    source = 'Unknown';
  }

  var url = TWILIO_URL_PREFIX + "/capabilitytokens/browserphone" + (isUsingTwilioConnect ? '/connect' : '');
  var time = Date.now();
  return http.get(url, {
    query: {
      source: source,
      clienttimeout: 120000 // 2 minutes TODO: WHY????!!

    }
  }).then(function (res) {
    res.timestamp = time;
    return new Token(res);
  });
}