'use es6';

import { OrderedSet } from 'immutable';
import { memoize } from './utils'; // low-cost memo, string -> short-array, not worried about memory implications

export var getClassNames = memoize(function (_ref) {
  var className = _ref.className;
  return className && OrderedSet(className.split(' '));
});
export var isNodeWithinClass = function isNodeWithinClass(_ref2) {
  var target = _ref2.target,
      parentClasses = _ref2.parentClasses;
  var targetSet = typeof classNames === 'string' ? OrderedSet.of(parentClasses) : OrderedSet(parentClasses);

  if (!target) {
    return false;
  }

  var classNameSet = getClassNames(target);
  return classNameSet && classNameSet.intersect(targetSet).isEmpty() === false ? true : isNodeWithinClass({
    target: target.parentElement,
    parentClasses: parentClasses
  });
};