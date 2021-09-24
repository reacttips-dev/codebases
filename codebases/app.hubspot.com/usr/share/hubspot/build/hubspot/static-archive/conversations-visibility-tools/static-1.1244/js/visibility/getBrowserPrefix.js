'use es6';

export function getBrowserPrefix() {
  var global = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
  var doc = global.document;
  var browserPrefixes = ['', 'webkit', 'moz', 'ms', 'o'];

  for (var i = 0; i < browserPrefixes.length; i++) {
    var prefix = browserPrefixes[i];
    var withPrefix = prefix ? prefix + "Hidden" : 'hidden';

    if (typeof doc[withPrefix] !== 'undefined') {
      return prefix;
    }
  }

  return null;
}