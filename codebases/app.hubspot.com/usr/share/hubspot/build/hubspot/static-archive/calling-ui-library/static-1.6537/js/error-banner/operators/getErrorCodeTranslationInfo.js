'use es6';

import memoize from 'transmute/memoize';
import isValidI18nKey from 'I18n/utils/isValidI18nKey';
import { ErrorCodeDirectory } from 'calling-client-interface/constants/errorCodeDirectory';
import { getCode } from 'calling-client-interface/operators/deviceErrorOperators';
export var BASE_DIRECTORY_ERROR_KEY = 'twilioClientErrors';
var INTERNATIONAL_FRAUD_RISK_MESSAGE_REGEX = /^Msg=No\+International\+Permission\.\+To\+call\+this\+phone\+number\+you\+must\+enable\+the/;
/**
 * Twilio device errors do not have detailed error codes that we can switch
 * on to determine the exact kind of error we are dealing with (see https://issues.hubspotcentral.com/browse/CT-4761).
 * Thus, here we pattern match the error message string to present useful
 * instructions/troubleshooting tips to the user if possible.
 */

var specialCaseDetailedErrorKey = function specialCaseDetailedErrorKey(currentI18nKey, errorCode, errorMessage) {
  switch (Number(errorCode)) {
    case 13227:
      {
        if (INTERNATIONAL_FRAUD_RISK_MESSAGE_REGEX.test(errorMessage)) {
          return currentI18nKey + "fraud-risk.";
        } else {
          return currentI18nKey + "default.";
        }
      }

    default:
      return currentI18nKey;
  }
};

export var getErrorCodeTranslationInfo = memoize(function (code, isPaidHub, isUsingTwilioConnect, errorMessage) {
  var _ref = ErrorCodeDirectory["" + code] || ErrorCodeDirectory.unknown,
      translationOptions = _ref.translationOptions;

  var messageKey = BASE_DIRECTORY_ERROR_KEY + "." + code + ".";
  messageKey = specialCaseDetailedErrorKey(messageKey, code, errorMessage);

  if (translationOptions.hasPaidHubMessage && isPaidHub) {
    messageKey += 'paidHubMessage';
  } else if (translationOptions.hasTwilioConnectMessage && isUsingTwilioConnect) {
    messageKey += 'twilioConnectMessage';
  } else {
    messageKey += 'message';
  }

  if (translationOptions.jsxOptions) {
    messageKey += '_jsx';
  }

  if (!isValidI18nKey(messageKey)) {
    messageKey = BASE_DIRECTORY_ERROR_KEY + ".unknown.message_jsx";
  }

  var titleKey = specialCaseDetailedErrorKey(BASE_DIRECTORY_ERROR_KEY + "." + code + ".", code, errorMessage) + "title";

  if (!isValidI18nKey(titleKey)) {
    titleKey = BASE_DIRECTORY_ERROR_KEY + ".unknown.title";
  }

  var jsxOptions = null;

  if (translationOptions.jsxOptions) {
    jsxOptions = translationOptions.jsxOptions;

    if (isPaidHub && jsxOptions.paid) {
      jsxOptions = jsxOptions.paid;
    } else if (isUsingTwilioConnect && jsxOptions.twilioConnect) {
      jsxOptions = jsxOptions.twilioConnect;
    } else if (jsxOptions.default) {
      jsxOptions = jsxOptions.default;
    } else {
      jsxOptions = {};
    }
  }

  return {
    titleKey: titleKey,
    messageKey: messageKey,
    jsxOptions: jsxOptions
  };
});
export var getIsSuspendedAccountError = function getIsSuspendedAccountError(deviceError) {
  return getCode(deviceError) === 31203;
};