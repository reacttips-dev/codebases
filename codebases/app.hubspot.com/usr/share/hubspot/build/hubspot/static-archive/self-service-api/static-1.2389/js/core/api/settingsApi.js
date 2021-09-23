'use es6';

import quickFetch from 'quick-fetch';
import memoize from '../utilities/memoize';
import http from 'hub-http/clients/apiClient';
import PortalIdParser from 'PortalIdParser';
var portalId = PortalIdParser.get();
var url = "hubs-settings/v1/hubs/" + portalId + "/settings";
var earlyRequestName = 'settings';
export var setSetting = function setSetting(key, value) {
  return http.post(url, {
    data: {
      hubId: portalId,
      internal: false,
      key: key,
      value: value
    }
  });
};
export var fetchSettings = memoize(function () {
  var earlyRequest = quickFetch.getRequestStateByName(earlyRequestName);

  if (!earlyRequest) {
    return http.get(url);
  }

  return new Promise(function (resolve, reject) {
    earlyRequest.whenFinished(function (result) {
      resolve(result);
      quickFetch.removeEarlyRequest(earlyRequestName);
    });
    earlyRequest.onError(function (err) {
      quickFetch.removeEarlyRequest(earlyRequestName);
      return http.get(url).then(resolve).catch(function () {
        return reject(err);
      });
    });
  });
});