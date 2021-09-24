'use es6';

export var EMPTY = null;
export var LOADING = undefined;

function equalsEmpty(value) {
  return value === EMPTY;
}

export function isEmpty() {
  for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }

  return values.some(equalsEmpty);
}

function equalsLoading(value) {
  return value === LOADING;
}

export function isLoading() {
  for (var _len2 = arguments.length, values = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    values[_key2] = arguments[_key2];
  }

  return values.some(equalsLoading);
}