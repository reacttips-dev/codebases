'use es6';

import { DEFAULT_OPTIONS } from './DefaultOptions';
import { logKeyUsage } from './performanceHelpers';
import { isSet } from './miscHelpers'; // Merge serveral hash options, checking if value is set before
// overwriting any value. The precedence is from left to right.
//
//     I18n.prepareOptions({name: "John Doe"}, {name: "Mary Doe", role: "user"});
//     #=> {name: "John Doe", role: "user"}
//

export var prepareOptions = function prepareOptions() {
  var options = {};

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  while (args.length) {
    var subject = args.shift();

    if (typeof subject !== 'object') {
      continue;
    }

    for (var attr in subject) {
      if (!subject.hasOwnProperty(attr)) {
        continue;
      }

      if (isSet(options[attr])) {
        continue;
      }

      options[attr] = subject[attr];
    }
  }

  return options;
};
export var getFullScope = function getFullScope(scope, options) {
  options = prepareOptions(options); // Deal with the scope as an array.

  if (scope.constructor === Array) {
    scope = scope.join(DEFAULT_OPTIONS.defaultSeparator);
  } // Deal with the scope option provided through the second argument.
  //
  //    I18n.t('hello', {scope: 'greetings'});
  //


  if (options.scope) {
    scope = [options.scope, scope].join(DEFAULT_OPTIONS.defaultSeparator);
  }

  return scope;
}; // Return current locale. If no locale has been set, then
// the current locale will be the default locale.

export var currentLocale = function currentLocale() {
  return I18n.locale || DEFAULT_OPTIONS.defaultLocale;
}; // Find and process the translation using the provided scope and options.
// This is used internally by some functions and should not be used as an
// public API.

export var lookup = function lookup(scope, options) {
  options = prepareOptions(options);
  var locales = I18n.locales.get(options.locale).slice();
  var requestedLocale = locales[0];
  var locale, scopes, translations, requestedLocaleValue;
  scope = getFullScope(scope, options);

  while (locales.length) {
    locale = locales.shift();
    scopes = scope.split(DEFAULT_OPTIONS.defaultSeparator);
    translations = I18n.translations[locale];

    if (!translations) {
      continue;
    }

    while (scopes.length) {
      translations = translations[scopes.shift()];

      if (translations === undefined || translations === null) {
        break;
      }
    }

    var getJustLangValue = function getJustLangValue(loc) {
      return loc.split('-')[0];
    };

    requestedLocaleValue = getJustLangValue(requestedLocale);

    if (translations !== undefined && translations !== null) {
      // HubSpot logic to track key usage and English fallback
      var translationLocaleFound = getJustLangValue(locale);
      var isNotRequestedLocale = requestedLocaleValue !== translationLocaleFound;
      var isFallbackLocale = translationLocaleFound === DEFAULT_OPTIONS.defaultLocale;
      logKeyUsage(scope, I18n.langEnabled && isNotRequestedLocale && isFallbackLocale, requestedLocaleValue); // End HubSpot logic to track English fallback

      return translations;
    }
  } // Custom HubSpot logic to log key usage


  logKeyUsage(scope, false, requestedLocaleValue);

  if (isSet(options.defaultValue)) {
    return options.defaultValue;
  }
};
export function initializeTranslateHelpers(I18n) {
  I18n.lookup = lookup;
  I18n.prepareOptions = prepareOptions;
}