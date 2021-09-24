'use es6'; // src derived from https://underscorejs.org/docs/underscore.html#section-176

var unescapeMap = {
  '&#x27;': "'",
  '&#x60;': '`',
  '&amp;': '&',
  '&gt;': '>',
  '&lt;': '<',
  '&quot;': '"'
};
var source = "(?:" + Object.keys(unescapeMap).join('|') + ")";
var testRegexp = RegExp(source);
var replaceRegexp = RegExp(source, 'g');
export function unescape(input) {
  input = input == null ? '' : "" + input;
  return testRegexp.test(input) ? input.replace(replaceRegexp, function (match) {
    return unescapeMap[match];
  }) : input;
}