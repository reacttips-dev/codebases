'use es6';

import { isHidden } from './isHidden';
export function wrapVisibilityCallback(callback) {
  return function (_ref) {
    var _ref$hidden = _ref.hidden,
        hidden = _ref$hidden === void 0 ? isHidden() : _ref$hidden;
    callback({
      isVisible: !hidden
    });
  };
}