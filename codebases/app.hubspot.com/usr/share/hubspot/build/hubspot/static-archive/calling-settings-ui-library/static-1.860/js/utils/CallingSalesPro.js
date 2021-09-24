'use es6';

import { getCallingLimits } from './getCallingLimits';
export var isSalesPro = function isSalesPro(scopes) {
  return getCallingLimits(scopes).type === 'pro';
};
export var isSalesStarter = function isSalesStarter(scopes) {
  return getCallingLimits(scopes).type === 'starter';
};
export var isStarterOrPro = function isStarterOrPro(scopes) {
  return getCallingLimits(scopes).type === 'pro' || getCallingLimits(scopes).type === 'starter';
};
export var isCallingFree = function isCallingFree(scopes) {
  return getCallingLimits(scopes).type === 'free';
};
export var isNearWarningLimit = function isNearWarningLimit(minutesRemaining, scopes) {
  return minutesRemaining <= getCallingLimits(scopes).warningThreshold;
};