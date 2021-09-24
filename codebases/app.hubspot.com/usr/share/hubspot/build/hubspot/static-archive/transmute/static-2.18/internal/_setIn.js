'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _count from './_count';
import _has from './_has';
import _get from './_get';
import _keyedEquivalent from './_keyedEquivalent';
import _reduce from './_reduce';
import _set from './_set';

function makeSetStack(keyPath, subject) {
  return _reduce([], function (acc, key) {
    if (!acc.length) {
      acc.push([subject, key]);
      return acc;
    }

    var _acc = _slicedToArray(acc[acc.length - 1], 2),
        prevValue = _acc[0],
        prevKey = _acc[1];

    var actualValue = _get(prevKey, prevValue);

    var nextValue = actualValue === undefined && !_has(prevKey, prevValue) ? _keyedEquivalent(prevValue) : actualValue;
    acc.push([nextValue, key]);
    return acc;
  }, keyPath);
}

export default function _setIn(keyPath, value, subject) {
  if (_count(keyPath) === 0) {
    return value;
  }

  var setStack = makeSetStack(keyPath, subject);
  var result = value;

  while (setStack.length > 0) {
    var _setStack$pop = setStack.pop(),
        _setStack$pop2 = _slicedToArray(_setStack$pop, 2),
        layer = _setStack$pop2[0],
        key = _setStack$pop2[1];

    result = _set(key, result, layer);
  }

  return result;
}