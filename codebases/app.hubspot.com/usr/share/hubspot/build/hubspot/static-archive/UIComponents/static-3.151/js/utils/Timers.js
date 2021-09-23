'use es6';

import * as Scheduler from 'scheduler';
/* eslint-disable compat/compat */

export var requestIdleCallback = window.requestIdleCallback || setTimeout;
export var cancelIdleCallback = window.cancelIdleCallback || clearTimeout;
export var requestSchedulerCallback = function requestSchedulerCallback(callback) {
  return Scheduler.unstable_scheduleCallback(Scheduler.unstable_NormalPriority, callback);
};
export var cancelSchedulerCallback = function cancelSchedulerCallback(id) {
  if (id) {
    Scheduler.unstable_cancelCallback(id);
  }
};
/**
 * Debounce function that uses Promise resolution for timing, resulting in a shorter delay than
 * `setTimeout()` in modern browsers.
 *
 * Borrowed from Popper.js:
 * https://github.com/popperjs/popper-core/blob/be548db65912e1126581a44faa7f758ff004680a/src/utils/debounce.js
 *
 * @param {Function} callback
 */

export var debounceByTick = function debounceByTick(callback) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(callback());
        });
      });
    }

    return pending;
  };
};