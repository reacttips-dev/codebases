'use es6';

import { getLocalSetting } from './LocalEnv';
var LOCAL_OVERRIDDEN = 'true';
var LOCAL_NOT_OVERRIDDEN = 'false';
var LOCAL = 'local';
var APP = 'app';
var TOOLS = 'tools';
var windowOrigin = window.location.origin || // IE
window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : '');

var getLocalEnvSetting = function getLocalEnvSetting(name) {
  return getLocalSetting(name, LOCAL);
};

var toLocal = function toLocal(url) {
  return url.replace(APP, LOCAL).replace(TOOLS, LOCAL);
};

export var getOrigin = function getOrigin(url) {
  if (url.indexOf('//') === 0) {
    url = "" + window.location.protocol + url;
  } else if (url.indexOf('/') === 0) {
    return windowOrigin;
  }

  var parts = url.split('://');

  if (parts.length > 1) {
    return parts[0] + "://" + parts[1].split('/')[0];
  } else {
    return windowOrigin;
  }
}; // Allows for a complete local src URL override or using a local instead of app

export var getIFrameSrc = function getIFrameSrc(iFrameName, url) {
  var localEnvSetting = getLocalEnvSetting(iFrameName);

  if (localEnvSetting === LOCAL_NOT_OVERRIDDEN) {
    return url;
  }

  if (localEnvSetting === LOCAL_OVERRIDDEN) {
    return toLocal(url);
  }

  return localEnvSetting || url;
};