"use strict";
'use es6';
/* eslint-disable hubspot-dev/hubspot-is-special */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.finishTrackingRequest = exports.startTrackingRequest = exports.getAllHttpRequestStats = exports.getHttpRequestStatsByState = exports.perfNow = exports.pageStartTimestamp = void 0;
var hasNavigationStart = window && window.performance && window.performance.timing && window.performance.timing.navigationStart;
var hasPerfNow = window && window.performance && window.performance.now;
var pageStartTimestamp = hasNavigationStart ? window.performance.timing.navigationStart : new Date().valueOf();
exports.pageStartTimestamp = pageStartTimestamp;
var perfNow = hasPerfNow ? window.performance.now.bind(window.performance) : function () {
  return new Date().valueOf() - pageStartTimestamp;
};
exports.perfNow = perfNow;
var requestCounter = 1;

function isValidFinalTrackingState(state) {
  var via = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (state === 'succeeded' || state === 'timedOut' || state === 'failed' || state === 'aborted') {
    return true; // eslint-disable-next-line no-console
  } else if (console && console.error) {
    console.error("Invalid state passed " + (via ? "to " + via : '') + " (" + state + ")"); // eslint-disable-line no-console
  }

  return false;
}

function isValidTrackingState(state) {
  var via = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (state === 'pending' || isValidFinalTrackingState(state, via)) {
    return true; // eslint-disable-next-line no-console
  } else if (console && console.error) {
    console.error("Invalid state passed " + (via ? "to " + via : '') + " (" + state + ")"); // eslint-disable-line no-console
  }

  return false;
}

var getHttpRequestStatsByState = function getHttpRequestStatsByState(state) {
  if (isValidTrackingState(state, 'getHttpRequestStatsByState')) {
    if (window.hubspot && window.hubspot._httpRequestStats && window.hubspot._httpRequestStats[state]) {
      return Object.keys(window.hubspot._httpRequestStats[state]).map(function (requestId) {
        return window.hubspot._httpRequestStats[state][requestId];
      });
    }
  }

  return [];
};

exports.getHttpRequestStatsByState = getHttpRequestStatsByState;

var getAllHttpRequestStats = function getAllHttpRequestStats() {
  return getHttpRequestStatsByState('pending').concat(getHttpRequestStatsByState('succeeded'), getHttpRequestStatsByState('timedOut'), getHttpRequestStatsByState('failed'), getHttpRequestStatsByState('aborted'));
}; // Hrm, unsure if I should exporting these global API functions and having that
// be the primary entrypoint... or if I should have no functions and let the
// data alone be the "API".


exports.getAllHttpRequestStats = getAllHttpRequestStats;

if (window.hubspot) {
  if (!window.hubspot.getAllHttpRequestStats) {
    window.hubspot.getAllHttpRequestStats = getAllHttpRequestStats;
  }

  if (!window.hubspot.getHttpRequestStatsByState) {
    window.hubspot.getHttpRequestStatsByState = getHttpRequestStatsByState;
  }
}

var startTrackingRequest = function startTrackingRequest(url, via) {
  var requestId = requestCounter++;

  if (window.hubspot) {
    // Storing with global data (instead of via closure), so that it is possible
    // for multiple versions of request-tracker to combine data.
    if (!window.hubspot._httpRequestStats) {
      window.hubspot._httpRequestStats = {
        pending: {},
        succeeded: {},
        timedOut: {},
        failed: {},
        aborted: {}
      };
    }

    if (!window.hubspot._httpRequestStats.pending) {
      window.hubspot._httpRequestStats.pending = {};
    }

    window.hubspot._httpRequestStats.pending[requestId] = {
      id: requestId,
      started: perfNow(),
      state: 'pending',
      url: url,
      via: via
    };
  }

  return requestId;
};

exports.startTrackingRequest = startTrackingRequest;

var finishTrackingRequest = function finishTrackingRequest(requestId, url) {
  var state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'succeeded';
  var otherInfo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (!isValidFinalTrackingState(state, "finishTrackingRequest for " + url)) {
    return;
  }

  if (window.hubspot && window.hubspot._httpRequestStats && window.hubspot._httpRequestStats.pending) {
    var requestInfo = window.hubspot._httpRequestStats.pending[requestId]; // Remove from pending requests (and only allow a specific request to ever
    // be "finished" a single time)

    if (requestInfo) {
      delete window.hubspot._httpRequestStats.pending[requestId];
      requestInfo.finished = perfNow();
      requestInfo.state = state;

      if (!window.hubspot._httpRequestStats[state]) {
        window.hubspot._httpRequestStats[state] = {};
      }

      window.hubspot._httpRequestStats[state][requestId] = requestInfo; // Add extra info to the request info object, such as status code and text,
      // but don't overwrite any existing properties (or write blank properties)

      Object.keys(otherInfo).forEach(function (key) {
        if (requestInfo[key] == null && otherInfo[key] != null) {
          requestInfo[key] = otherInfo[key];
        }
      });
    }
  }
};

exports.finishTrackingRequest = finishTrackingRequest;