/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');

module.exports.SchedulingMixin = {
  setTimeout(fn, interval) {
    let idTimeout;
    if (this._scheduled_timeouts == null) {
      this._scheduled_timeouts = [];
    }
    this._scheduled_timeouts.push((idTimeout = setTimeout(fn, interval)));
    return idTimeout;
  },

  setInterval(fn, interval) {
    let idInterval;
    if (this._scheduled_intervals == null) {
      this._scheduled_intervals = [];
    }
    this._scheduled_intervals.push((idInterval = setInterval(fn, interval)));
    return idInterval;
  },

  requestAnimationFrame(fn) {
    let idRequest;
    if (this._scheduled_frameRequests == null) {
      this._scheduled_frameRequests = [];
    }
    this._scheduled_frameRequests.push((idRequest = requestAnimationFrame(fn)));
    return idRequest;
  },

  callback(fn) {
    const callbacks =
      this._scheduled_callbacks != null
        ? this._scheduled_callbacks
        : (this._scheduled_callbacks = []);
    this._scheduled_callbacks.push(fn);
    // A version of the callback that only runs if cancelScheduled hasn't
    // been called
    return function (...args) {
      const index = callbacks.indexOf(fn);
      if (index !== -1) {
        callbacks.splice(index, 1);
        return fn.apply(this, args);
      } else {
        return;
      }
    };
  },

  cancelScheduled() {
    if (this._scheduled_callbacks != null) {
      while (this._scheduled_callbacks.length) {
        this._scheduled_callbacks.pop();
      }
    }

    if (this._scheduled_intervals != null) {
      for (const interval of Array.from(this._scheduled_intervals)) {
        clearInterval(interval);
      }
    }

    if (this._scheduled_timeouts != null) {
      for (const timeout of Array.from(this._scheduled_timeouts)) {
        clearTimeout(timeout);
      }
    }

    if (this._scheduled_frameRequests != null) {
      for (const frameRequest of Array.from(
        this._scheduled_frameRequests != null
          ? this._scheduled_frameRequests
          : [],
      )) {
        cancelAnimationFrame(frameRequest);
      }
    }
  },

  defer(fn) {
    return this.setTimeout(fn, 1);
  },

  debounce(fn, wait) {
    if (wait == null) {
      wait = 1;
    }
    return this.dynamicDebounce(fn, () => wait);
  },

  dynamicDebounce(fn, getInterval) {
    const setTimeout = this.setTimeout.bind(this);
    let timeout = null;
    return function () {
      const args = arguments;
      const later = () => {
        timeout = null;
        fn.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, getInterval.apply(this, args));
    };
  },

  callOnceAfter(fn, wait) {
    if (wait == null) {
      wait = 1;
    }
    const setTimeout = this.setTimeout.bind(this);
    let timeout = null;
    return function () {
      if (timeout) {
        return;
      }
      const args = arguments;
      const later = () => {
        timeout = null;
        fn.apply(this, args);
      };
      timeout = setTimeout(later, wait);
    };
  },

  throttle(func, wait, options) {
    let args, result, timeout;
    if (options == null) {
      options = {};
    }
    let context = (args = result = timeout = null);
    const leading = options.leading != null ? options.leading : true;
    const trailing = options.trailing != null ? options.trailing : true;

    const setTimeout = this.setTimeout.bind(this);
    let previous = null;
    const later = function () {
      previous = leading ? _.now() : 0;
      timeout = null;
      result = func.apply(context, args);
      return (context = args = null);
    };
    return function () {
      const now = _.now();
      if (previous == null && !leading) {
        previous = now;
      }

      const remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && trailing) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  },
};
