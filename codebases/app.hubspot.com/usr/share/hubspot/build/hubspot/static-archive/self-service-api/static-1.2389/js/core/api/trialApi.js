'use es6';

import http from 'hub-http/clients/apiClient';
var TRIAL_ENDPOINT_BASE = 'trials/v1/hub-trials';

var _cachedAvailable;

var _cachedTrials;

export var TrialsApi = {
  getTrialState: function getTrialState() {
    if (_cachedTrials) {
      return _cachedTrials;
    }

    _cachedTrials = http.get(TRIAL_ENDPOINT_BASE + "?active=false");
    return _cachedTrials;
  },
  getAvailableTrials: function getAvailableTrials() {
    if (_cachedAvailable) {
      return _cachedAvailable;
    }

    _cachedAvailable = http.get(TRIAL_ENDPOINT_BASE + "/available");
    return _cachedAvailable;
  }
};