'use es6';

import Raven from 'Raven';
import enviro from 'enviro';
import http from 'hub-http/clients/apiClient';
import userInfo from 'hub-http/userInfo';
import PortalIdParser from 'PortalIdParser';
import I18n from 'I18n';
import _getLang from 'I18n/utils/getLang';
import { createClient as createUsageTrackerClient } from 'usage-tracker-core';
import { debugKey } from 'usage-tracker-core/storageKeys';
import draftEvents from 'draft-plugins/events.yaml';
import emptyFunction from 'react-utils/emptyFunction';
import { getTempStorage, setTempStorage } from './tempStorage';
import { isInternal } from '../lib/utils';

var reportError = function reportError(err) {
  var extras = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  Raven.captureException(err, Object.assign({
    source: 'draft-plugins usage tracking'
  }, extras));
};

var reportNetworkError = function reportNetworkError(err) {
  return reportError(err, {
    fingerPrint: ['usage-tracker-js', 'network']
  });
};

export var createClient = function createClient() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$client = _ref.client,
      client = _ref$client === void 0 ? http : _ref$client,
      _ref$getUserInfo = _ref.getUserInfo,
      getUserInfo = _ref$getUserInfo === void 0 ? userInfo : _ref$getUserInfo;

  var path = 'usage-logging/v1/log/hublytics-multi/no-auth';

  var getEmail = function getEmail() {
    return getUserInfo({
      ignoreRedirect: true
    }).then(function (_ref2) {
      var _ref2$user = _ref2.user,
          user = _ref2$user === void 0 ? null : _ref2$user;
      return user != null ? user.email : null;
    }).catch(function () {
      return null;
    });
  };

  return createUsageTrackerClient({
    getDebug: function getDebug() {
      return enviro.debug(debugKey);
    },
    getEmail: getEmail,
    getHubId: function getHubId() {
      return PortalIdParser.get() || null;
    },
    getHstc: function getHstc() {
      return null;
    },
    getLang: function getLang() {
      return I18n.Info.then(_getLang);
    },
    getTempStorage: getTempStorage,
    setTempStorage: setTempStorage,
    reportError: reportError,
    send: function send(_ref3) {
      var events = _ref3.events,
          query = _ref3.query,
          isAuthed = _ref3.isAuthed;
      var endpoint = path + "?" + query;
      var data = events;

      var sendXhr = function sendXhr() {
        var promise;

        if (isAuthed) {
          promise = client.post(endpoint, {
            data: data
          }).catch(reportNetworkError);
        }

        if (promise && typeof promise.done === 'function') {
          promise.done();
        }
      };

      sendXhr();
    }
  });
};
export var createTracker = function createTracker(client) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (isInternal()) {
    return {
      track: emptyFunction
    };
  }

  if (!client) {
    client = createClient();
  }

  var configWithDefaults = Object.assign({
    events: draftEvents,
    properties: {
      namespace: 'rich-text',
      text_library: 'draft.js'
    }
  }, config);
  return client.createTracker(configWithDefaults);
};