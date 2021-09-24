'use es6';

import { isServiceWorkerScopeQa } from './EnvUtil';
var NOTIFICATIONS_SERVICE_WORKER = 'NOTIFICATIONS SERVICE WORKER';
var LOG_PREFIX = NOTIFICATIONS_SERVICE_WORKER + " -";
export function workerDebug() {
  if (isServiceWorkerScopeQa()) {
    var _console;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    (_console = console).debug.apply(_console, [LOG_PREFIX].concat(args));
  }
}