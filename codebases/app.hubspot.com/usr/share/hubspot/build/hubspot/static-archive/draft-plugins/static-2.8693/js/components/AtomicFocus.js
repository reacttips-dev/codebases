'use es6';

import { isNodeWithinClass } from '../lib/isNodeWithinClass';
import BaseAtomicFocus from './BaseAtomicFocus';

var AtomicFocus = function AtomicFocus(parentClasses) {
  var removable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var isNodeWithinBlock = function isNodeWithinBlock(_ref) {
    var target = _ref.target;
    return isNodeWithinClass({
      target: target,
      parentClasses: parentClasses
    });
  };

  return BaseAtomicFocus(isNodeWithinBlock, removable);
};

export default AtomicFocus;