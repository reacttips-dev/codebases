'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import Alarm from '../model/Alarm';
import ApiError from './ApiError';
import { isQa, getHublet } from '../util/Env';
import { getCookie } from '../util/Cookies';

var AlarmApi = /*#__PURE__*/function () {
  function AlarmApi(dom, storage, events) {
    _classCallCheck(this, AlarmApi);

    this.dom = dom;
    this.storage = storage;
    this.events = events;
  }

  _createClass(AlarmApi, [{
    key: "getAlarms",
    value: function getAlarms(appName, callback) {
      var dom = this.dom,
          storage = this.storage,
          events = this.events;
      var httpRequest = this.getHttpRequest();

      if (!httpRequest) {
        throw "Could not create XMLHttpRequest. Browser may not support AJAX.";
      }

      var url = this.getUrl(appName);

      var requestHandler = function requestHandler() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.status === 200) {
            try {
              var result = JSON.parse(httpRequest.responseText);
              var alarms = [];

              if (Array.isArray(result)) {
                alarms = result.map(function (alarmData) {
                  return new Alarm(alarmData, dom, storage, events);
                });
              }

              callback(alarms, null);
            } catch (e) {
              callback(null, new ApiError(httpRequest, e));
            }

            return;
          } else {
            callback(null, new ApiError(httpRequest));
          }
        }
      };

      httpRequest.onreadystatechange = requestHandler;
      httpRequest.open('GET', url);
      var csrfCookie = getCookie('csrf.app');

      if (csrfCookie !== null) {
        httpRequest.withCredentials = true;
        httpRequest.setRequestHeader('X-HubSpot-CSRF-hubspotapi', csrfCookie);
      } else {
        console.log('No CSRF Cookie found.');
      }

      httpRequest.send();
      return true;
    }
    /**
     * @VisibleForTesting
     */

  }, {
    key: "getHttpRequest",
    value: function getHttpRequest() {
      return new XMLHttpRequest();
    }
  }, {
    key: "getUrl",
    value: function getUrl(appName) {
      var qa = isQa() ? 'qa' : '';
      var lang = window.I18n && window.I18n.langEnabled ? window.I18n.lang : 'en';
      var portalIdArray = /^\/(?:[A-Za-z0-9-_]*)\/(\d+)(?:\/|$)/.exec(document.location.pathname);
      var maybePortalIdParam = portalIdArray && portalIdArray.length > 1 ? "/" + portalIdArray[1] : '';
      var hublet = getHublet(document.location.hostname);
      var hubletStr = hublet === 'na1' ? '' : "-" + hublet;
      return "https://api" + hubletStr + ".hubspot" + qa + ".com/firealarm/v3/alarm/" + appName + maybePortalIdParam + "?lang=" + lang;
    }
  }]);

  return AlarmApi;
}();

export default AlarmApi;