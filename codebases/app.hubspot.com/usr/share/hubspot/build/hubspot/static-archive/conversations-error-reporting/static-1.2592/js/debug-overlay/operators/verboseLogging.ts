import enviro from 'enviro';

var safelyCallLocalStorage = function safelyCallLocalStorage(method) {
  return function () {
    try {
      var fn = localStorage[method];
      return fn.apply(void 0, arguments);
    } catch (e) {
      return undefined;
    }
  };
};

var safeStorage = {
  setItem: safelyCallLocalStorage('setItem'),
  getItem: safelyCallLocalStorage('getItem'),
  removeItem: safelyCallLocalStorage('removeItem')
};
var DEBUG_LOGGING = '4';

var enableVerboseLogging = function enableVerboseLogging() {
  enviro.setDebug('conversations', true);
  safeStorage.setItem('ABLY_LOG_LEVEL', DEBUG_LOGGING);
};

var disableVerboseLogging = function disableVerboseLogging() {
  enviro.setDebug('conversations', false);
  safeStorage.removeItem('ABLY_LOG_LEVEL');
};

export var isEnabled = function isEnabled() {
  var logLevelVerbose = safeStorage.getItem('ABLY_LOG_LEVEL') === DEBUG_LOGGING;
  return Boolean(enviro.debug('conversations') && logLevelVerbose);
};
export var toggleVerboseLogging = function toggleVerboseLogging() {
  if (isEnabled()) {
    disableVerboseLogging();
  } else {
    enableVerboseLogging();
  }
};