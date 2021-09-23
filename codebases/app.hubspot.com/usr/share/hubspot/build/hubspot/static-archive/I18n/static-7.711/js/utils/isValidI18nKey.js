'use es6';

function isPluralI18nKey(lookupValue) {
  if (typeof lookupValue !== 'object') {
    return false;
  }

  var lookupKeys = Object.keys(lookupValue);
  var pluralKeysCount = 0;

  if (lookupKeys.length <= 3) {
    lookupKeys.forEach(function (key) {
      if (key === 'zero' || key === 'one' || key === 'other') {
        pluralKeysCount += 1;
      }
    });
  }

  return !!pluralKeysCount && pluralKeysCount === lookupKeys.length;
}

function isJSXKey(message, lookupValue) {
  return typeof lookupValue === 'function' && message.slice(-4).indexOf('_jsx') >= 0;
}

export default (function (message) {
  var lookupValue = I18n.lookup(message);
  return !!(lookupValue && (typeof lookupValue === 'string' || isJSXKey(message, lookupValue))) || isPluralI18nKey(lookupValue);
});