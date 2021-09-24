"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableRequestTracking = exports.reportStatusCode = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _core = require("../middlewares/core");

var HARVEST_DELAY = 1000 * 10;
var METRICS_ENDPOINT = "https://" + (0, _core.resolveApi)((0, _core.hubletApi)('api', 'hubspot')) + "/metrics/v1/frontend/send";
var AJAX_QUEUE = new Set();
var trackRequests = Boolean(navigator.sendBeacon);
var flushRequestsTimeout = undefined;
var enabledSendOnUnload = false;

var getPerfData = function getPerfData(windowObj) {
  var entries = windowObj.performance.getEntriesByType('resource');

  if (!entries || !entries.length) {
    return {};
  }

  var requests = entries.filter(function (res) {
    return res.initiatorType === 'xmlhttprequest';
  });
  var entryMap = {};
  requests.forEach(function (_ref) {
    var name = _ref.name,
        duration = _ref.duration,
        requestStart = _ref.requestStart,
        responseStart = _ref.responseStart,
        transferSize = _ref.transferSize;

    if (!entryMap[name]) {
      entryMap[name] = [];
    }

    entryMap[name].push({
      duration: duration,
      transferSize: transferSize,
      serverTime: responseStart - requestStart,
      requestStart: requestStart
    });
  });
  return entryMap;
};

var findPerfData = function findPerfData(requestDataForUrl, requestSendTime) {
  if (!requestDataForUrl) {
    return {};
  }

  var requestData = requestDataForUrl.filter(function (perfData) {
    return requestSendTime - perfData.requestStart < 10;
  });
  return requestData.length ? requestData[0] : {};
};

var send = function send() {
  try {
    if (AJAX_QUEUE.size === 0) {
      return;
    }

    var ajaxData = (0, _toConsumableArray2.default)(AJAX_QUEUE);
    AJAX_QUEUE.clear();
    var iframeData = {};

    try {
      iframeData = window.apiIframe && window.apiIframe.contentWindow ? getPerfData(window.apiIframe.contentWindow) : {};
    } catch (e) {// Skip iframe data
    }

    var currentWindowPerfData = {};

    try {
      currentWindowPerfData = getPerfData(window);
    } catch (e) {// Skip current window data
    }

    var requestPerfData = Object.assign({}, currentWindowPerfData, {}, iframeData);
    var hydratedRequests = ajaxData.map(function (_ref2) {
      var url = _ref2.url,
          sendTime = _ref2.sendTime,
          statusCode = _ref2.statusCode;
      var perfDataForRequest = findPerfData(requestPerfData[url], sendTime);
      return Object.assign({
        url: url,
        statusCode: statusCode
      }, perfDataForRequest);
    });
    var sent = navigator.sendBeacon(METRICS_ENDPOINT, JSON.stringify({
      datapoints: hydratedRequests
    }));

    if (!sent) {
      ajaxData.forEach(function (request) {
        return AJAX_QUEUE.add(request);
      });
    }
  } catch (sendError) {// Don't do anything if this fails.
  }
};

var reportStatusCode = function reportStatusCode(requestStatus) {
  if (!trackRequests) {
    return;
  }

  AJAX_QUEUE.add(requestStatus);
  clearTimeout(flushRequestsTimeout);

  if (AJAX_QUEUE.size >= 25) {
    send();
  }

  flushRequestsTimeout = setTimeout(send, HARVEST_DELAY);

  if (!enabledSendOnUnload) {
    window.addEventListener('unload', send, false);
    enabledSendOnUnload = true;
  }
};

exports.reportStatusCode = reportStatusCode;

var enableRequestTracking = function enableRequestTracking() {// No-op until it has been removed from downstream projects
};

exports.enableRequestTracking = enableRequestTracking;