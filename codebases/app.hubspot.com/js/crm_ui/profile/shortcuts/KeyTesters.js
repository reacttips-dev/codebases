'use es6';

import { Set as ImmutableSet } from 'immutable';
export function keyCombination() {
  for (var _len = arguments.length, keyTesters = new Array(_len), _key = 0; _key < _len; _key++) {
    keyTesters[_key] = arguments[_key];
  }

  function testKeys(inputKeys) {
    if (keyTesters.length !== inputKeys.size) {
      return false;
    }

    return keyTesters.filter(function (tester) {
      return !!inputKeys.find(function (key) {
        return tester.testKeys(key);
      });
    }).length === keyTesters.length;
  }

  return {
    testKeys: testKeys
  };
}
export function anyOf() {
  for (var _len2 = arguments.length, keys = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    keys[_key2] = arguments[_key2];
  }

  function testKeys(inputKeys) {
    var inputKey = inputKeys;

    if (ImmutableSet.isSet(inputKeys)) {
      if (inputKeys.size > 1) {
        return false;
      }

      inputKey = inputKeys.first();
    }

    return keys.includes(inputKey);
  }

  return {
    testKeys: testKeys
  };
}
export function exactly(key) {
  function testKeys(inputKeys) {
    var inputKey = inputKeys;

    if (ImmutableSet.isSet(inputKeys)) {
      if (inputKeys.size > 1) {
        return false;
      }

      inputKey = inputKeys.first();
    }

    return inputKey === key;
  }

  return {
    testKeys: testKeys
  };
}