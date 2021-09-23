'use es6';

import quickFetch from 'quick-fetch';
import http from 'hub-http/clients/apiClient';
import { logCallingError } from 'calling-error-reporting/report/error';
import buildSettingsOmnibusRequestPath from '../utils/buildSettingsOmnibusRequestPath';

function getSettings() {
  var url = buildSettingsOmnibusRequestPath();
  return http.get(url, {
    query: {
      createAccount: false
    }
  });
}

function getEarlyRequestSettings(_ref) {
  var earlyRequester = _ref.earlyRequester,
      requestName = _ref.requestName;
  return new Promise(function (resolve, reject) {
    earlyRequester.whenFinished(function (response) {
      quickFetch.removeEarlyRequest(requestName);
      resolve(response);
    });
    earlyRequester.onError(function (request, error) {
      logCallingError({
        errorMessage: 'Settings Quick fetch failed.',
        extraData: {
          error: error,
          request: request,
          requestName: requestName
        },
        tags: {
          requestName: requestName
        }
      });
      quickFetch.removeEarlyRequest(requestName);
      reject(error);
    });
  }).catch(function () {
    /* Retry in case of the failed */
    return getSettings();
  });
}

export function requestFn() {
  var time = Date.now();
  var promise;
  var requestName = 'callSettingsOmnibus';
  var earlyOmnibusRequest = quickFetch.getRequestStateByName(requestName);

  if (earlyOmnibusRequest) {
    promise = getEarlyRequestSettings({
      earlyRequester: earlyOmnibusRequest,
      requestName: requestName
    });
  } else {
    promise = getSettings();
  }

  return promise.then(function (res) {
    var initialLoadSettings = res.initialLoadSettings;

    if (initialLoadSettings.token.tokenType === 'NO_ACCOUNT') {
      initialLoadSettings.isEnabled = false;
    } else {
      initialLoadSettings.isEnabled = true;
    }

    initialLoadSettings.time = time;
    return res;
  }).catch(function (error) {
    logCallingError({
      errorMessage: 'Getting the twilio settings failed.',
      extraData: {
        error: error
      },
      tags: {
        requestName: 'twilioSettings'
      }
    });

    if (error.status === 404) {
      return {
        isEnabled: false
      };
    } else {
      return Promise.reject(error);
    }
  });
}