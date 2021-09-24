'use es6';

import enviro from 'enviro';
import I18n from 'I18n';
import _getLang from 'I18n/utils/getLang';
import userInfo from 'hub-http/userInfo';
import apiClient from 'hub-http/clients/apiClient';
import noAuthApiClient from 'hub-http/clients/noAuthApiClient';
import { getFullUrl } from 'hubspot-url-utils';
import { createClient } from 'usage-tracker-core';
import { debugKey, hstcKey } from 'usage-tracker-core/storageKeys';
import * as cookieHelper from './helpers/cookieHelper';
import sendBeacon from './helpers/sendBeacon';
import reportError from './helpers/reportError';
import * as tempStorage from './containers/tempStorage';
var hasBeaconSupport = navigator && typeof navigator.sendBeacon === 'function';
var origin = getFullUrl('api');
var path = '/usage-logging/v1/log/hublytics-multi/no-auth';

var reportNetworkError = function reportNetworkError(err) {
  return reportError(err, {
    fingerprint: ['usage-tracker-js', 'network']
  });
};

var getDebug = function getDebug() {
  return enviro.debug(debugKey);
};

var isLocal = !enviro.deployed();
var isQa = enviro.getShort() === 'qa';
var trackingClient = createClient({
  clientName: 'app',
  getDebug: getDebug,
  getEmail: function getEmail() {
    return userInfo().then(function (_ref) {
      var user = _ref.user;
      return user.email;
    });
  },
  getHubId: function getHubId() {
    return userInfo().then(function (_ref2) {
      var portal = _ref2.portal;
      return portal.portal_id;
    });
  },
  getHstc: function getHstc() {
    return cookieHelper.get(hstcKey) || '';
  },
  getLang: function getLang() {
    return I18n.Info.then(_getLang);
  },
  getTempStorage: tempStorage.get,
  setTempStorage: tempStorage.set,
  logError: function logError(err) {
    if (isLocal || isQa || getDebug()) {
      console.error(err);
    }
  },
  reportError: reportError,
  send: function send(_ref3) {
    var events = _ref3.events,
        query = _ref3.query,
        isAuthed = _ref3.isAuthed,
        isBeforeUnload = _ref3.isBeforeUnload;
    var endpoint = "" + origin + path + "?" + query;
    var data = events;

    var sendXhr = function sendXhr() {
      var promise;

      if (isAuthed) {
        promise = apiClient.post(endpoint, {
          data: data
        }).catch(reportNetworkError);
      } else {
        promise = noAuthApiClient.post(endpoint, {
          data: data
        }).catch(reportNetworkError);
      }

      if (promise && typeof promise.done === 'function') {
        promise.done();
      }
    };

    if (isBeforeUnload && hasBeaconSupport) {
      sendBeacon(endpoint, data, sendXhr);
    } else {
      sendXhr();
    }
  }
});
export default trackingClient;