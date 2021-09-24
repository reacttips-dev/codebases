'use es6';

import SafeStorage from 'SafeStorage';
var LOG_PREFIX = 'PROMPTS';
var PROMPTS_DEBUG = 'PROMPTS_DEBUG';
export function isPromptsDebugEnabled() {
  try {
    return SafeStorage.getItem(PROMPTS_DEBUG) === 'true';
  } catch (e) {
    return false;
  }
}

var logMessage = function logMessage(message) {
  return LOG_PREFIX + " - " + message;
};

export function debug(message, value) {
  if (isPromptsDebugEnabled()) {
    console.debug(logMessage(message), value);
  }
}
export function warn(message, value) {
  if (isPromptsDebugEnabled()) {
    console.warn(logMessage(message), value);
  }
}