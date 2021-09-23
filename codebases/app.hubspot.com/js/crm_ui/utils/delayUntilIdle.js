'use es6';

var DELAY_TIMEOUT = 5000;
export function delayUntilIdle(callback) {
  var delay = window.requestIdleCallback || window.setTimeout;
  var delayOptions = delay === window.requestIdleCallback ? {
    timeout: DELAY_TIMEOUT
  } : 0;
  delay(callback, delayOptions);
}