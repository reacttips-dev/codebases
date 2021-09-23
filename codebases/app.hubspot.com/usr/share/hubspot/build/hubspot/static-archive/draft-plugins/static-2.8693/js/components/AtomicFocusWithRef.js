'use es6';

import { isNodeWithinClass } from '../lib/isNodeWithinClass';
import BaseAtomicFocus from './BaseAtomicFocus';

var isNodeWithinRefCreator = function isNodeWithinRefCreator(parentClasses) {
  return function (_ref) {
    var target = _ref.target,
        blockRef = _ref.blockRef;

    try {
      return blockRef.contains(target) || isNodeWithinClass({
        target: target,
        parentClasses: parentClasses
      });
    } catch (e) {
      return false;
    }
  };
};

var AtomicFocusWithRef = function AtomicFocusWithRef(parentClasses) {
  var removable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return BaseAtomicFocus(isNodeWithinRefCreator(parentClasses), removable);
};

export default AtomicFocusWithRef;