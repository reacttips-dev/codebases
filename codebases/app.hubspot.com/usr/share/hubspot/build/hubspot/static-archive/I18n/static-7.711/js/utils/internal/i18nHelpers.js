'use es6';

import { nullPlaceholder, missingTranslation, missingPlaceholder } from './warnings';
import { DEFAULT_OPTIONS } from './DefaultOptions';
import { isSet, isObject } from './miscHelpers';
import { lookup, prepareOptions } from './translateHelpers';
import { formatNumber } from './numberFormatters'; // This function interpolates the all variables in the given message.

export var interpolate = function interpolate(message, options) {
  options = prepareOptions(options);
  var matches = message.match(DEFAULT_OPTIONS.placeholder);
  var placeholder, value, name, regex;

  if (!matches) {
    return message;
  }

  while (matches.length) {
    placeholder = matches.shift();
    name = placeholder.replace(DEFAULT_OPTIONS.placeholder, '$1');

    if (isSet(options[name])) {
      value = options[name].toString().replace(/\$/gm, '_#$#_');
    } else if (name in options) {
      // HACK: Pass options through to nullPlaceholder/missingPlaceholder
      // value = this.nullPlaceholder(placeholder, message);
      value = nullPlaceholder(placeholder, message, options);
    } else {
      // value = this.missingPlaceholder(placeholder, message);
      value = missingPlaceholder(placeholder, message, options);
    }

    regex = new RegExp(placeholder.replace(/\{/gm, '\\{').replace(/\}/gm, '\\}'));
    message = message.replace(regex, value);
  }

  return message.replace(/_#\$#_/g, '$');
}; // Pluralize the given scope using the `count` value.
// The pluralized translation may have other placeholders,
// which will be retrieved from `options`.

export var pluralize = function pluralize(count, scope, options) {
  options = prepareOptions(options);
  var translations, pluralizer, keys, key, message; // HACK, HubSpot fix
  // if (scope instanceof Object) {

  if (isObject(scope)) {
    translations = scope; // END HACK
  } else {
    translations = lookup(scope, options);
  }

  if (!translations) {
    return missingTranslation(scope, options);
  }

  pluralizer = I18n.pluralization.get(options.locale);
  keys = pluralizer(count);

  while (keys.length) {
    key = keys.shift();

    if (isSet(translations[key])) {
      message = translations[key];
      break;
    }
  } // HACK, if no translation keys matched then return instead of throwing an error (#303)


  if (typeof message !== 'string') {
    return undefined;
  } // END HACK
  // HACK, format count to a localized string instead of just casting it
  // options.count = String(count);


  if (typeof options.count === 'number') {
    options.count = formatNumber(count);
  } // END HACK


  return interpolate(message, options);
}; // Translate the given scope with the provided options.

export var translate = function translate(scope, options) {
  options = prepareOptions(options);
  var translation = lookup(scope, options); // HACK: If the translation in this locale is a non-pluralization object, try
  // falling back on the default locale. Otherwise we'd just render "[object Object]"!
  // See HubSpot/I18n#209

  if (isObject(translation) && !isSet(options.count)) {
    translation = lookup(scope, prepareOptions({
      locale: DEFAULT_OPTIONS.defaultLocale
    }, options));
  } // END HACK


  if (translation === undefined || translation === null) {
    return missingTranslation(scope, options);
  } // HACK: Format count param if the translation is not an object


  if (!isObject(translation) && typeof options.count === 'number') {
    options.count = formatNumber(options.count);
  } // END HACK


  if (typeof translation === 'string') {
    translation = interpolate(translation, options); // HACK, HubSpot fix
    // } else if (translation instanceof Object && this.isSet(options.count)) {
  } else if (isObject(translation) && isSet(options.count)) {
    // END HACK
    translation = pluralize(options.count, translation, options); // HACK: Fall back on default locale if pluralization failed

    if (translation === undefined && options.locale !== DEFAULT_OPTIONS.defaultLocale) {
      return translate(scope, prepareOptions({
        locale: DEFAULT_OPTIONS.defaultLocale
      }, options));
    } // END HACK

  }

  return translation;
};