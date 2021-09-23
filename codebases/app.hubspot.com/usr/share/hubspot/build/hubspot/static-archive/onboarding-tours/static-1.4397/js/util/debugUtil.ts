var ONBOARDING_TOUR = 'ONBOARDING_TOUR';
var ONBOARDING_TOUR_DEBUG = ONBOARDING_TOUR + "_DEBUG";
var LOG_PREFIX = ONBOARDING_TOUR + " - ";

function isOnboardingTourDebugEnabled() {
  try {
    return localStorage.getItem(ONBOARDING_TOUR_DEBUG) === 'true';
  } catch (error) {
    /* noop */
  }

  return false;
}

export function debug(debugMessage) {
  if (isOnboardingTourDebugEnabled()) {
    var _console;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    (_console = console).debug.apply(_console, [LOG_PREFIX, debugMessage].concat(args));
  }
}