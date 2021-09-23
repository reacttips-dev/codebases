'use es6';

import { DEFAULT_OPTIONS } from './DefaultOptions';
import { getFullScope, currentLocale } from './translateHelpers';
import { htmlEscape } from './miscHelpers';
var sendSentryOnMissingValues = true;
var sendSentryOnMissingTranslations = true;
var MISSING_NOTIFICATIONS = []; // Return a missing placeholder message for given parameters

var missingPlaceholderInitial = function missingPlaceholderInitial(placeholder) {
  return '[missing ' + placeholder + ' value]';
};

export var nullPlaceholder = function nullPlaceholder() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return missingPlaceholderInitial(args);
};

var missingNotificationWrapper = function missingNotificationWrapper(originalFunction, eventName, sendSentries, originalArgs, sentryOptions) {
  if (sentryOptions == null) {
    sentryOptions = {};
  }

  var message = originalFunction.apply(I18n, originalArgs);
  var sentryMessage = sentryOptions.message || message;

  if (MISSING_NOTIFICATIONS.indexOf(sentryMessage) < 0) {
    MISSING_NOTIFICATIONS.push(sentryMessage);
    var missingNoticationError = new Error("I18n: " + sentryMessage);
    var extraErrorMetadata = {
      i18nErrorType: eventName,
      currentLocale: I18n.langEnabled ? I18n.locale : 'en-us',
      translationKey: sentryOptions.translationKey,
      placeholderName: sentryOptions.placeholderName
    };

    if (window.newrelic) {
      window.newrelic.noticeError(missingNoticationError, extraErrorMetadata);
    }

    if (sendSentries && window.Raven) {
      window.Raven.captureException(missingNoticationError, {
        extra: extraErrorMetadata
      });
    }

    try {
      if (localStorage.getItem('TRACK_I18N_MISSING_TRANSLATIONS')) {
        localStorage.setItem('I18N_MISSING_TRANSLATIONS', MISSING_NOTIFICATIONS);
      }
    } catch (e) {//ignore
    }
  } // Trigger event if in browser context (trigger not currently around in node/schablone)


  if (typeof I18n.trigger === 'function') {
    I18n.trigger(eventName, message);
  }

  return message;
};

var originalMissingTranslation = function originalMissingTranslation(scope, options) {
  //guess intended string
  if (I18n.missingBehaviour === 'guess') {
    //get only the last portion of the scope
    var s = scope.split('.').slice(-1)[0]; //replace underscore with space && camelcase with space and lowercase letter

    return (DEFAULT_OPTIONS.missingTranslationPrefix.length > 0 ? DEFAULT_OPTIONS.missingTranslationPrefix : '') + s.replace('_', ' ').replace(/([a-z])([A-Z])/g, function (match, p1, p2) {
      return p1 + ' ' + p2.toLowerCase();
    });
  }

  var fullScope = getFullScope(scope, options);
  var fullScopeWithLocale = [currentLocale(), fullScope].join(DEFAULT_OPTIONS.defaultSeparator);
  return '[missing “' + fullScopeWithLocale + '” translation]';
};

export var missingTranslation = function missingTranslation(scope) {
  var missingTranslationMessage = 'Missing translation: "' + scope + '"';
  console.warn("I18n: " + missingTranslationMessage);
  var sentryOptions = {
    translationKey: scope,
    message: missingTranslationMessage
  };
  return htmlEscape(missingNotificationWrapper(originalMissingTranslation, 'missingTranslation', sendSentryOnMissingTranslations, [scope], sentryOptions));
};
var originalMissingValue = missingPlaceholderInitial;
export var missingPlaceholder = function missingPlaceholder(placeholder, message, options) {
  var missingPlaceholderMessage = "Missing placeholder: " + placeholder + " in \"" + options.__scope + "\"";
  var sentryOptions = {
    message: missingPlaceholderMessage,
    translationKey: options.__scope,
    placeholderName: placeholder
  };
  console.warn("I18n: " + missingPlaceholderMessage);
  return missingNotificationWrapper(originalMissingValue, 'missingPlaceholder', sendSentryOnMissingValues, [placeholder, message, options], sentryOptions);
};
export function initializeWarnings(I18n) {
  I18n.missingTranslation = missingTranslation;
  I18n.missingPlaceholder = missingPlaceholder;
}