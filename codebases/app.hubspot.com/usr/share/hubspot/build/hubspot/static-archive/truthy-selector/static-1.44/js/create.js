'use es6';

import { createSelectorCreator } from 'reselect';
/*
Reselect tweaked to wait for all dependents to be truthy before evaluatinging selector.  avoids lots of null checking
 */

/* eslint-disable prefer-rest-params */

function defaultEqualityCheck(a, b) {
  return a === b;
}

function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  var nextArgs = Array.prototype.slice.call(next); // lb: patching reselect to wait for all args to be truthy before evaling selector

  if (!nextArgs.every(function (a) {
    return typeof a !== 'undefined' && a !== null;
  })) {
    return true;
  } // end patch


  if (prev === null || next === null || prev.length !== next.length) {
    return false;
  } // Do this in a for loop (and not a `forEach` or an `every`) so we can determine equality as fast as possible.


  var length = prev.length;

  for (var i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false;
    }
  }

  return true;
}

function truthyMemoize(func) {
  var equalityCheck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultEqualityCheck;
  var lastArgs = null;
  var lastResult = null; // we reference arguments instead of spreading them for performance reasons

  return function compareArgs() {
    if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
      // apply arguments instead of spreading for performance.
      lastResult = func.apply(null, arguments);
    }

    lastArgs = arguments;
    return lastResult;
  };
}

export default createSelectorCreator(truthyMemoize);