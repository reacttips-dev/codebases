'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as BehaviorTypes from '../constants/BehaviorTypes';
import { DefaultExtension } from '../extensions/DefaultExtension';
import invariant from 'react-utils/invariant';
export var createExtension = function createExtension(extension) {
  var extraKeys = Object.keys(extension).filter(function (key) {
    return !BehaviorTypes[key];
  });
  invariant(extraKeys.length === 0, 'createExtension: All behaviors must be known. Please use the constants in BehaviorTypes.js. Unknown behaviors found: %s', extraKeys);
  var nonFunctionBehaviors = Object.entries(extension).reduce(function (nonFunctions, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        behaviorType = _ref2[0],
        behavior = _ref2[1];

    if (typeof behavior !== 'function') {
      nonFunctions.push(behaviorType);
    }

    return nonFunctions;
  }, []);
  invariant(nonFunctionBehaviors.length === 0, 'createExtension: All behaviors must be functions. Please change these behaviors to be functions: %s', nonFunctionBehaviors);
  return Object.assign({}, DefaultExtension, {}, extension);
};