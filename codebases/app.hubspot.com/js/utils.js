'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
var lastHeight = document.body.clientHeight;
export function postMessage(type, data) {
  window.parent.postMessage(JSON.stringify(Object.assign({
    type: type
  }, data)), '*');
}
export function verifyEvent(window, event) {
  return window === event.source;
}

function createMutationObserver() {
  var observer = new MutationObserver(function () {
    var nextHeight = document.body.clientHeight;

    if (lastHeight !== nextHeight) {
      lastHeight = nextHeight;
      postMessage('HEIGHT_CHANGE', {
        value: document.body.clientHeight
      });
    }
  });
  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true
  });
  return observer;
}

export function addListeners() {
  document.documentElement.addEventListener('click', function () {
    postMessage('FRAME_CLICK');
  });
  window.addEventListener('resize', function () {
    var nextHeight = document.body.clientHeight;

    if (lastHeight !== nextHeight) {
      lastHeight = nextHeight;
      postMessage('HEIGHT_CHANGE', {
        value: document.body.clientHeight
      });
    }
  });
  createMutationObserver();
}
export var settingsArrayToMap = function settingsArrayToMap(portalSettings) {
  var portalSettingsMap = portalSettings.reduce(function (acc, _ref) {
    var key = _ref.key,
        value = _ref.value;
    return Object.assign({}, acc, _defineProperty({}, key, value));
  }, {});
  return portalSettingsMap;
}; // NOTE: this key references marketing-pro, all guides actually share this one prefix

var SETTINGS_KEY_BASE = 'growth-trial-guide-progress-marketing-pro';
export var getSettingKeyFromTaskKey = function getSettingKeyFromTaskKey(taskKey) {
  return SETTINGS_KEY_BASE + "-" + taskKey;
}; // Given the settings array response and an array of taskKeys,
// returns the subset of taskKeys that have been completed.

export var completedTaskKeysFromSettings = function completedTaskKeysFromSettings(portalSettings, taskKeys) {
  var portalSettingsMap = settingsArrayToMap(portalSettings);
  return taskKeys.filter(function (taskKey) {
    return portalSettingsMap[getSettingKeyFromTaskKey(taskKey)];
  });
};
export var featureOrderFromSettings = function featureOrderFromSettings(portalSettings, upgradeProduct) {
  var portalSettingsMap = settingsArrayToMap(portalSettings);
  var rawFeatureOrder = portalSettingsMap["trial-guide-" + upgradeProduct + ":feature-order"];
  if (rawFeatureOrder) return JSON.parse(rawFeatureOrder);
  return null;
};