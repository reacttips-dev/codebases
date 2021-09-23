'use es6';

import { IFRAME_HOST } from 'ui-addon-iframeable/messaging/IFrameControlMessage';
import { getLocalSetting } from './LocalEnv';
var MSG_SENT = 'SENT';
var MSG_RECEIVED = 'RECEIVED';
var IFRAME_EMBED = 'EMBED';

var debugEnabled = function debugEnabled(name) {
  return !!getLocalSetting(name, 'debug');
};

var toMessage = function toMessage(name, message) {
  return "[iframeable " + name + "] " + message;
};

var logMessage = function logMessage(name, source, direction, message) {
  if (debugEnabled(name)) {
    console.log(toMessage(name, source + " " + direction), message);
  }
};

var logError = function logError(name, source, error) {
  if (debugEnabled(name)) {
    var _console;

    for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    (_console = console).error.apply(_console, [toMessage(name, source), error].concat(args));
  }
};

export var logHostError = function logHostError(name, error) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  return logError.apply(void 0, [name, IFRAME_HOST, error].concat(args));
};
export var logEmbedError = function logEmbedError(name, error) {
  for (var _len3 = arguments.length, args = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    args[_key3 - 2] = arguments[_key3];
  }

  return logError.apply(void 0, [name, IFRAME_EMBED, error].concat(args));
};
export var logHostMessageSent = function logHostMessageSent(name, message) {
  return logMessage(name, IFRAME_HOST, MSG_SENT, message);
};
export var logHostMessageReceived = function logHostMessageReceived(name, message) {
  return logMessage(name, IFRAME_HOST, MSG_RECEIVED, message);
};
export var logEmbedMessageSent = function logEmbedMessageSent(name, message) {
  return logMessage(name, IFRAME_EMBED, MSG_SENT, message);
};
export var logEmbedMessageReceived = function logEmbedMessageReceived(name, message) {
  return logMessage(name, IFRAME_EMBED, MSG_RECEIVED, message);
};