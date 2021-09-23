'use es6';

import Raven from 'Raven';
import enviro from 'enviro'; // Adapted from https://git.hubteam.com/HubSpot/content-detail-ui/pull/853/files

var debugLog = function debugLog() {
  if (enviro.debug('SEQUENCES_WOOTRIC_SURVEY')) {
    var _console;

    (_console = console).log.apply(_console, arguments);
  }
};

export var triggerWootricSurvey = function triggerWootricSurvey() {
  try {
    window.wootric('run');
  } catch (error) {
    Raven.captureException(error, {
      extra: {
        from: 'triggerWootricSurvey'
      }
    });
  }
};
export var MAX_ATTEMPTS = 10;
var DELAY_MILLISECONDS = 2 * 1000; // Show the wootric survey (via global that comes from nav), but use retries to try and wait until
// the side-loaded Wootric JS is available

export var triggerWootricSurveyWhenAvailable = function triggerWootricSurveyWhenAvailable() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$attemptNum = _ref.attemptNum,
      attemptNum = _ref$attemptNum === void 0 ? 1 : _ref$attemptNum,
      _ref$disableRetries = _ref.disableRetries,
      disableRetries = _ref$disableRetries === void 0 ? false : _ref$disableRetries,
      _ref$triggerSurveyFun = _ref.triggerSurveyFunc,
      triggerSurveyFunc = _ref$triggerSurveyFun === void 0 ? triggerWootricSurvey : _ref$triggerSurveyFun;

  if (attemptNum <= MAX_ATTEMPTS) {
    if (window.wootric) {
      debugLog('Wootric global is available, triggering wootric survey');
      triggerSurveyFunc();
    } else if (!disableRetries) {
      debugLog("Wootric global is not yet available, retrying in " + DELAY_MILLISECONDS / 1000 + " seconds (attemptNum = " + attemptNum + ")");
      setTimeout(function () {
        triggerWootricSurveyWhenAvailable({
          attemptNum: attemptNum + 1,
          triggerSurveyFunc: triggerSurveyFunc
        });
      }, DELAY_MILLISECONDS);
    }
  }
};