var getTimeStamp = require('@uppy/utils/lib/getTimeStamp'); // Swallow all logs, except errors.
// default if logger is not set or debug: false


var justErrorsLogger = {
  debug: function debug() {},
  warn: function warn() {},
  error: function error() {
    var _console;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (_console = console).error.apply(_console, ["[Uppy] [" + getTimeStamp() + "]"].concat(args));
  }
}; // Print logs to console with namespace + timestamp,
// set by logger: Uppy.debugLogger or debug: true

var debugLogger = {
  debug: function debug() {
    // IE 10 doesn’t support console.debug
    var debug = console.debug || console.log;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    debug.call.apply(debug, [console, "[Uppy] [" + getTimeStamp() + "]"].concat(args));
  },
  warn: function warn() {
    var _console2;

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return (_console2 = console).warn.apply(_console2, ["[Uppy] [" + getTimeStamp() + "]"].concat(args));
  },
  error: function error() {
    var _console3;

    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return (_console3 = console).error.apply(_console3, ["[Uppy] [" + getTimeStamp() + "]"].concat(args));
  }
};
module.exports = {
  justErrorsLogger: justErrorsLogger,
  debugLogger: debugLogger
};