'use es6';

import { translate as text } from './i18nHelpers';
import { formatParam } from './paramFormatters';
export var translate = function translate() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var lastOption = args[args.length - 1];
  var includesOptions = typeof lastOption !== 'string';
  var originalOpts = includesOptions && lastOption ? args[args.length - 1] : {};
  var key = includesOptions ? args.slice(0, args.length - 1).join('.') : args.join('.');
  var modifiedOpts = {}; // Copy originalOpts to modifiedOpts, formatting numeric params and escaping others along the way

  for (var optName in originalOpts) {
    if (originalOpts.hasOwnProperty(optName)) {
      var optValue = originalOpts[optName];

      if (optValue != null) {
        modifiedOpts[optName] = formatParam(optName, optValue);
      }
    }
  }

  if (!modifiedOpts.locale && I18n.locale.split('-')[0] !== 'en' && !I18n.langEnabled && !I18n.publicPage) {
    // TEST - I18n.debugLog('Forcing translation in English, lang is not enabled');
    modifiedOpts.locale = 'en';
  } // Attach the translation key to the options object for missingPlaceholder


  modifiedOpts.__scope = key; // Warn if I18n isn't ready yet (#296)

  if (I18n.fired && !I18n.fired.ready) {
    var tooEarlyError = new Error("I18n.text called before ready with key '" + key + "' - See go/i18n-help for more info");
    setTimeout(function () {
      throw tooEarlyError;
    }, 0);
  }

  return text(key, modifiedOpts);
};
export var initializeText = function initializeText(I18n) {
  I18n.text = translate;
};