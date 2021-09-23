import enviro from 'enviro';
var logShown = {};

var shouldLog = function shouldLog(key) {
  return !enviro.deployed() && (key == null || !logShown[key]);
};

var markAsShown = function markAsShown(key) {
  if (key) {
    logShown[key] = true;
  }
};

export var warn = function warn(_ref) {
  var _ref$message = _ref.message,
      message = _ref$message === void 0 ? '' : _ref$message,
      key = _ref.key,
      url = _ref.url;

  if (url) {
    message += "\nFor details, see: " + url;
  }

  if (shouldLog(key)) {
    console.warn(message);
    markAsShown(key);
  }
};
export default {
  warn: warn
};