'use es6';

import I18n from 'I18n';
export var millisecondsToTimer = function millisecondsToTimer(milliseconds) {
  var seconds = milliseconds / 1000;
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var minutesString = "" + Math.floor(minutes % 60);
  var secondsString = "" + Math.floor(seconds % 60);

  if (secondsString.length === 1) {
    secondsString = 0 + secondsString;
  }

  if (hours > 0 && minutesString.length === 1) {
    minutesString = 0 + minutesString;
  }

  var duration = [minutesString, secondsString];

  if (hours > 0) {
    duration.unshift(hours);
  }

  return duration.join(':');
};
export var getPrecision = function getPrecision(number) {
  // Show decimal only if the value is a non-integer
  return number % 1 === 0 ? 0 : 2;
};
export var parseNumber = function parseNumber(number) {
  if (typeof number === 'number') {
    return number;
  }

  var parsed = Number(number);

  if (!isNaN(parsed)) {
    return parsed;
  }

  return I18n.parseNumber(number);
};
export var number = function number(value, options) {
  if (options == null) {
    options = {};
  }

  var result = parseNumber(value);
  return I18n.formatNumber(result, Object.assign({
    precision: getPrecision(result)
  }, options));
};
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}