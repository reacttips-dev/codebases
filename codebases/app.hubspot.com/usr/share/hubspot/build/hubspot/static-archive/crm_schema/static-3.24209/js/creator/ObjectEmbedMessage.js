'use es6';

import PortalIdParser from 'PortalIdParser';
export var TYPE = {
  create: 'oc',
  associate: 'ASSOCIATE_PANEL_EVENT'
};
export var VERSION = 1;

var useLocalEnv = function useLocalEnv(action) {
  var type = action === 'create' ? 'creator' : 'associator';

  try {
    return localStorage.getItem("CRM:object-" + type + ":local") === 'true';
  } catch (err) {
    return false;
  }
};

var manuallyConstructOrigin = function manuallyConstructOrigin() {
  return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : '');
};

var getOrigin = function getOrigin() {
  return window.origin || manuallyConstructOrigin();
};

var toLocal = function toLocal(origin) {
  return origin.replace('app', 'local');
};

var toApp = function toApp(origin) {
  return origin.replace('local', 'app');
};

var validOrigin = function validOrigin(origin) {
  return toApp(getOrigin()) === toApp(origin);
};

var validSender = function validSender(_ref, action) {
  var type = _ref.type,
      version = _ref.version;
  return type === TYPE[action] && version > 0 && version <= VERSION;
};

export var getIframeOrigin = function getIframeOrigin() {
  var origin = getOrigin(); // eslint-disable-next-line react-hooks/rules-of-hooks

  if (useLocalEnv()) {
    return toLocal(origin);
  }

  return toApp(origin);
};
export var toMessage = function toMessage(data, action) {
  return Object.assign({}, data, {
    type: TYPE[action],
    version: VERSION
  });
};
export var validEvent = function validEvent(_ref2, action) {
  var origin = _ref2.origin,
      data = _ref2.data;
  return validOrigin(origin) && validSender(data, action);
};
export var getIframeUrl = function getIframeUrl(action) {
  return getIframeOrigin() + "/embed/" + PortalIdParser.get() + "/object/" + action;
};
export var inIframe = function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};