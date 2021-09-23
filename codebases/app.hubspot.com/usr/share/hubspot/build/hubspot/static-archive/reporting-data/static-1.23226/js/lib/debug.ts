import cached from './cached';
import development from './development';
var colors = ['#ea90b1', '#fea58e', '#f5c78e', '#a2d28f', '#51d3d9', '#81c1fd', '#bda9ea', '#9784c2'];

var next = function () {
  var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return function () {
    return colors[index++ % colors.length];
  };
}();

export var debug = cached('debug', function (namespace) {
  var color = next();

  var logger = function logger() {
    if (development()) {
      var _console;

      var styles = "color: " + color + "; font-weight: bold;";

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_console = console).log.apply(_console, ["%c" + namespace, styles].concat(args));
    }
  };

  logger.once = cached(logger);
  return logger;
}); // @ts-expect-error TODO remove usages

debug.log = function (namespace) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return debug(namespace).apply(void 0, args);
}; // @ts-expect-error TODO remove usages


debug.once = function (namespace) {
  var _debug;

  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return (_debug = debug(namespace)).once.apply(_debug, args);
};