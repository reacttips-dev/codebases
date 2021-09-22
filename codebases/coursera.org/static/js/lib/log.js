/* This file exposes a familiar interface for setting logging level
 *  and using the console API appropriately.
 * The primary purpose is to encourage logging in development but shut it off by default in testing/prod.
 */

// wrap console.log, in case its accidentally or purposefully used
if (typeof window !== 'undefined') {
  window.console.log = window.console.log || function () {};
  window.console.error = window.console.error || function () {};
  window.console.warn = window.console.warn || function () {};
  window.console.info = window.console.info || function () {};

  // thank you IE9. much <3
  if (!window.console.log.apply) {
    window.console.log = Function.prototype.bind.call(window.console.log, window.console);
    window.console.error = Function.prototype.bind.call(window.console.error, window.console);
    window.console.warn = Function.prototype.bind.call(window.console.warn, window.console);
    window.console.info = Function.prototype.bind.call(window.console.info, window.console);
  }
}

// window.console in Browser or global console in Node
const localConsole = typeof window !== 'undefined' ? window.console : console;

const Logger = function (options) {
  this.options = options || {};
};

Logger.prototype.customize = function (options) {
  this.options = options || {};
  return this;
};

Logger.prototype.info = function () {
  if (this.options.level == 'info') {
    localConsole.info(...arguments);
  }
  return this;
};

Logger.prototype.warn = function () {
  if (/info|warn/.test(this.options.level)) {
    localConsole.warn(...arguments);
  }
  return this;
};

Logger.prototype.error = function () {
  if (/error|warn|info/.test(this.options.level)) {
    localConsole.error(...arguments);
  }
  return this;
};

export default function (options) {
  return new Logger(options);
}
