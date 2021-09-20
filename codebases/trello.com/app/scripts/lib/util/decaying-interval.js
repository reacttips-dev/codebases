/* eslint-disable
    eqeqeq,
    @typescript-eslint/no-use-before-define,
    @trello/disallow-filenames,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Util } = require('app/scripts/lib/util');

const defaultOptions = {
  resetAfterMouseMove: true,
  intervals: [
    {
      iterations: 6,
      timeout: Util.getMs({ seconds: 10 }),
    },
    {
      iterations: 10,
      timeout: Util.getMs({ minutes: 1 }),
    },
  ],
};

const startDecayingInterval = function (fn, options) {
  if (options == null) {
    options = defaultOptions;
  }
  let intervals = null;
  let idTimeout = null;
  let watchingMouse = false;

  const cancel = function () {
    clearTimeout(idTimeout);
    if (watchingMouse) {
      document.removeEventListener('mousemove', start);
      watchingMouse = false;
    }
  };

  const watchMouse = function () {
    if (options.resetAfterMouseMove && !watchingMouse) {
      document.addEventListener('mousemove', start);
      watchingMouse = true;
    }
  };

  const nextStep = function () {
    if (intervals.length) {
      const nextInterval = intervals.shift();
      idTimeout = setTimeout(function () {
        fn();
        return requestAnimationFrame(nextStep);
      }, nextInterval);
      if (nextInterval > options.intervals[0].timeout) {
        watchMouse();
      }
    } else {
      watchMouse();
    }
  };

  const start = function () {
    cancel();
    intervals = [];
    for (const { iterations, timeout } of Array.from(options.intervals)) {
      for (
        let i = 0, end = iterations, asc = 0 <= end;
        asc ? i < end : i > end;
        asc ? i++ : i--
      ) {
        intervals.push(timeout);
      }
    }
    nextStep();
  };

  start();

  return cancel;
};

module.exports.startDecayingInterval = startDecayingInterval;
