/* eslint-disable no-console */
/* global __DEVELOPMENT__ */
import ExecutionEnvironment from 'exenv';
import debounce from 'lodash.debounce';

import { IS_QUIET } from 'constants/appConstants';
import { formatDate } from 'helpers/dateUtils';
import AppEnvironment from 'helpers/AppEnvironment';

if (ExecutionEnvironment.canUseDOM
  && (typeof window.console === 'undefined' || window.console.log === undefined || window.console.debug === undefined || window.console.error === undefined)) {
  // polyfill
  window.console = window.console || {};
  window.console.log = () => {};
  window.console.debug = () => {};
  window.console.error = () => {};
}

function logToErrCgi(name, trace) {
  if (window && typeof window.onerror === 'function') {
    window.onerror(name, window.location.href, trace);
  }
}

function modifyLogCall(logFunc, clientOrServer, args) {
  console[logFunc].apply(console, [clientOrServer].concat(Array.prototype.slice.call(args)));
}

function getClientLogger(logFunc) {
  if (IS_QUIET) {
    return () => null;
  }

  return function() {
    modifyLogCall(logFunc, 'Marty Client:', arguments);
  };
}

function getServerLogger(logFunc) {
  const env = process.env.MARTY_EB_ENV || 'unset';
  if (process.env.NODE_ENV === 'test') {
    return () => null;
  }
  // needs to be function rather than fat arrow or else `arguments` get lost
  return function() {
    const timestamp = formatDate('DD/MMM/YYYY:HH:mm:ss.ms ZZ');
    const loggingPrefix = `[${timestamp}] martyenv=${env}`;
    modifyLogCall(logFunc, loggingPrefix, arguments);
  };
}

export function devLogger(message) {
  if (__DEVELOPMENT__ && !IS_QUIET) {
    logger(message);
  }
}

export class DevLoggerGroupDebounced {
  constructor({ groupName, debounceTime }) {
    this.groupName = groupName;
    this.debounceTime = debounceTime;
    this.itemsToLog = [];
  }
  logGroup = debounce(() => {
    console.groupCollapsed(this.groupName);
    this.itemsToLog.forEach(item => console.log(item));
    console.groupEnd();
    this.itemsToLog = [];
  }, this.debounceTime);
  addLog = item => {
    if (__DEVELOPMENT__ && !IS_QUIET && typeof console.groupCollapsed === 'function') {
      this.itemsToLog.push(item);
      this.logGroup();
    }
  };
}

const logger = ExecutionEnvironment.canUseDOM ? getClientLogger('log') : getServerLogger('log');

export const logError = ExecutionEnvironment.canUseDOM ? getClientLogger('error') : getServerLogger('error');
export const logDebug = ExecutionEnvironment.canUseDOM ? getClientLogger('debug') : getServerLogger('log');
export const logToServer = AppEnvironment?.hasZfc ? logToErrCgi : logError;
export const logErrorAndLogToServer = error => {
  logError(error);
  logToServer(error);
};

export default logger;
