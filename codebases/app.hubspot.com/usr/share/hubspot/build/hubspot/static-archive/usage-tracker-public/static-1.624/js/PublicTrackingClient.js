'use es6';

import enviro from 'enviro';
import noAuthApiClient from 'hub-http/clients/noAuthApiClient';
import { getFullUrl } from 'hubspot-url-utils';
import { createClient } from 'usage-tracker-core';
import { debugKey } from 'usage-tracker-core/storageKeys';
import { getHstc } from './helpers/cookieHelper';
import { defaultLanguage } from './helpers/langHelper';
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

var getTrackerHstc = function getTrackerHstc() {
  return new Promise(function (resolve) {
    /* eslint-disable */
    var interval;
    var timeout;
    interval = setInterval(function () {
      var hstc = getHstc();

      if (hstc) {
        clearTimeout(timeout);
        clearInterval(interval);
        resolve(hstc);
      }
    }, 100);
    timeout = setTimeout(function () {
      if (!getHstc()) {
        clearInterval(interval);

        if (enviro.debug(debugKey) && console && typeof console.warn === 'function') {
          console.warn('Could not get tracker hstc after 8 seconds');
        }

        resolve(null);
      }
    }, 8000);
  });
};

var PublicTrackingClient = createClient({
  clientName: 'public',
  getDebug: getDebug,
  getEmail: function getEmail() {
    return null;
  },
  getHubId: function getHubId() {
    return null;
  },
  getHstc: getTrackerHstc,
  getLang: function getLang() {
    return defaultLanguage;
  },
  getTempStorage: tempStorage.get,
  setTempStorage: tempStorage.set,
  logError: function logError(err) {
    if (getDebug()) {
      console.error(err);
    }
  },
  reportError: reportError,
  send: function send(_ref) {
    var events = _ref.events,
        query = _ref.query,
        isBeforeUnload = _ref.isBeforeUnload;
    var endpoint = "" + origin + path + "?" + query;
    var data = events;

    var sendXhr = function sendXhr() {
      var promise = noAuthApiClient.post(endpoint, {
        data: data
      }).catch(reportNetworkError);

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
export default PublicTrackingClient;