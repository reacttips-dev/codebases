'use es6';

export function createKeyboardShortcut(action) {
  for (var _len = arguments.length, keyTesters = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    keyTesters[_key - 1] = arguments[_key];
  }

  return function (keys) {
    if (keyTesters.find(function (tester) {
      return tester.testKeys(keys);
    })) {
      action();
    }
  };
}