'use es6';
/*
Ported from https://github.com/jashkenas/underscore/blob/master/underscore.js and made to use Immutable.js
License: MIT, https://github.com/jashkenas/underscore/blob/master/LICENSE
*/

import { Map as ImmutableMap } from 'immutable';
var ESCAPE_MAP = ImmutableMap({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;'
});
var UNESCAPE_MAP = ESCAPE_MAP.flip();

function createEscaper(map) {
  var escaper = function escaper(match) {
    return map.get(match);
  };

  var source = "(?:" + map.keySeq().toArray().join('|') + ")";
  var testRegexp = RegExp(source);
  var replaceRegexp = RegExp(source, 'g');
  return function (string) {
    string = string == null ? '' : "" + string;
    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
  };
}

export var escape = createEscaper(ESCAPE_MAP);
export var unescape = createEscaper(UNESCAPE_MAP);