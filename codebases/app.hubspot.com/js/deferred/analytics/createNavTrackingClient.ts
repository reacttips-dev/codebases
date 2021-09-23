import { createClient } from 'usage-tracker-core';
import { debugKey, hstcKey } from 'usage-tracker-core/storageKeys';
import { POST } from 'unified-navigation-ui/utils/API';
import getOrigin from 'unified-navigation-ui/utils/getOrigin';
import { getCookie } from 'unified-navigation-ui/utils/cookie';
import * as tempStorage from 'unified-navigation-ui/utils/tempStorage';
import { getPortalId } from 'unified-navigation-ui/utils/getPortalId';
var DEFAULT_LOCALE = 'en-us';

var sendBeacon = function sendBeacon(endpoint, data) {
  var onScheduleFailure = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  var blob = new Blob([JSON.stringify(data)], {
    type: 'text/plain'
  });
  var didSchedule = navigator.sendBeacon(endpoint, blob);

  if (!didSchedule && typeof onScheduleFailure === 'function') {
    onScheduleFailure();
  }

  return didSchedule;
};

export default function createNavTrackingClient(userEmail) {
  var hasBeaconSupport = navigator && typeof navigator.sendBeacon === 'function';
  var origin = getOrigin();
  var path = '/usage-logging/v1/log/hublytics-multi/no-auth';
  return createClient({
    getDebug: function getDebug() {
      if (window.enviro && typeof window.enviro.debug === 'function') {
        return window.enviro.debug(debugKey);
      }

      return false;
    },
    getEmail: function getEmail() {
      return userEmail;
    },
    getHubId: function getHubId() {
      return getPortalId();
    },
    getHstc: function getHstc() {
      return getCookie(hstcKey);
    },
    getLang: function getLang() {
      if (window.I18n) {
        return window.I18n.locale;
      }

      return DEFAULT_LOCALE;
    },
    getTempStorage: tempStorage.get,
    setTempStorage: tempStorage.set,
    reportError: function reportError(err) {
      if (window.Raven && typeof window.Raven.captureException === 'function') {
        window.Raven.captureException(err);
      }
    },
    send: function send(_ref) {
      var events = _ref.events,
          query = _ref.query,
          isBeforeUnload = _ref.isBeforeUnload;
      var endpoint = path + "?" + query;
      var data = events;

      var sendXhr = function sendXhr() {
        return POST(endpoint, data);
      };

      if (isBeforeUnload && hasBeaconSupport) {
        sendBeacon("" + origin + endpoint, data, sendXhr);
      } else {
        sendXhr();
      }
    }
  });
}