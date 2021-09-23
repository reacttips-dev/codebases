"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setStaticAppInfo = setStaticAppInfo;
exports.send = send;

var _enviro = _interopRequireDefault(require("enviro"));

var _hubspot = _interopRequireDefault(require("hubspot"));

// @ts-expect-error provided by head-dlb
function sendBeacon(url) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  try {
    navigator.sendBeacon(url, data);
  } catch (___err) {// drop errors
  }
}

var staticAppInfo = {
  package: _hubspot.default && _hubspot.default.bender && _hubspot.default.bender.currentProject || 'unknown',
  version: _hubspot.default && _hubspot.default.bender && _hubspot.default.bender.currentProjectVersion || 'unknown'
};

function setStaticAppInfo(newInfo) {
  Object.assign(staticAppInfo, newInfo);
}

function getMetricsUrl() {
  return "https://api" + (_enviro.default.getHublet() === 'na1' ? '' : "-" + _enviro.default.getHublet()) + ".hubspot" + (_enviro.default.isQa() ? 'qa' : '') + ".com/metrics/v1/frontend/custom/send?hs_static_app=" + staticAppInfo.package + "&hs_static_app_version=" + staticAppInfo.version;
}

function send(metricReports) {
  // @ts-expect-error dead code check, this is safe
  if (process.env.NODE_ENV !== 'production') {
    if (_enviro.default.debug('METRICS')) {
      console.log('[metrics-js] Dropping local datapoint', metricReports);
      return;
    }
  }

  if (_enviro.default.debug('METRICS')) {
    console.log('[metrics-js] Datapoint sent', metricReports);
  }

  sendBeacon(getMetricsUrl(), JSON.stringify(metricReports));
}