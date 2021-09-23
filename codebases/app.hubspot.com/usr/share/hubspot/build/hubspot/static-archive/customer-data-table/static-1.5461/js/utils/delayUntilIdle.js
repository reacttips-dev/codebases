'use es6';

export function delayUntilIdle(callback) {
  var delay = window.requestIdleCallback || window.setTimeout;
  var delayOptions = delay === window.requestIdleCallback ? {
    timeout: 5000
  } : 0;
  delay(callback, delayOptions);
}