'use es6'; // htmlEscape utility function based on Underscore's _.escape

var htmlEscapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;'
};
var htmlCharPattern = '(?:&|<|>|"|\'|`)';
var htmlTestRegexp = RegExp(htmlCharPattern);
var htmlReplaceRegexp = RegExp(htmlCharPattern, 'g');

var htmlReplacement = function htmlReplacement(match) {
  return htmlEscapeMap[match];
};

export var htmlEscape = function htmlEscape(string) {
  if (htmlTestRegexp.test(string)) {
    return string.replace(htmlReplaceRegexp, htmlReplacement);
  } else {
    return string;
  }
}; // Check if value is different than undefined and null;

export var isSet = function isSet(value) {
  return value !== undefined && value !== null;
}; // Steal Underscore's isObject implementation to deal with node not correctly respecting
// `x instanceof Object` across different requires.

export var isObject = function isObject(obj) {
  return obj === Object(obj);
};