'use es6';

import { createStack } from 'hub-http';
import { onResponse, onResponseError } from 'hub-http/middlewares/core';
import { checkNetwork } from '../network/checkNetwork';
import { buildNetworkUnavailableError } from '../util/buildNetworkUnavailableError';
var ERROR_CODES = ['TIMEOUT', 'NETWORKERROR'];
/**
 * @description A hub-http middleware that decorates timeout
 * and network errors with a special message when the client
 * is disconnected from the internet.
 */

export var checkNetworkOnTimeout = function checkNetworkOnTimeout() {
  var networkAvailable = true;
  return createStack(onResponse(function (response) {
    networkAvailable = true;
    return Promise.resolve(response);
  }), onResponseError(function (error) {
    var status = error.status,
        errorCode = error.errorCode;

    if (status === 0 && ERROR_CODES.includes(errorCode)) {
      return !networkAvailable ? Promise.reject(buildNetworkUnavailableError(error)) : checkNetwork().then(function (_ref) {
        var online = _ref.online;

        if (!online) {
          networkAvailable = false;
          return Promise.reject(buildNetworkUnavailableError(error));
        }

        return Promise.reject(error);
      });
    }

    return Promise.reject(error);
  }));
};