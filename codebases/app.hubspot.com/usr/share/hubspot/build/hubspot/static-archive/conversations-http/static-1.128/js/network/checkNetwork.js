'use es6';

import enviro from 'enviro';
import noAuthApiClient from 'hub-http/clients/noAuthApiClient';
export var NETWORK_CHECK_TIMEOUT_MS = 5000;

var getHostName = function getHostName() {
  return enviro.deployed() ? 'app' : 'local';
};

var getDomainSuffix = function getDomainSuffix() {
  return enviro.isQa() ? 'qa' : '';
};

export var checkNetwork = function checkNetwork() {
  return noAuthApiClient.get("https://" + getHostName() + ".hubspot" + getDomainSuffix() + ".com/network-check/is-the-internet-up.txt", {
    timeout: NETWORK_CHECK_TIMEOUT_MS,
    query: {
      rnd: Math.random()
    }
  }).then(function () {
    return {
      online: true
    };
  }, function (error) {
    return {
      online: false,
      error: error
    };
  });
};