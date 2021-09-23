'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import { isElement } from './utils/DOMShims';
/*
 * A NavSibling object represents the element that
 * is to be injected into the DOM via the NavInjector.
 */

var NavSibling = function NavSibling() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$key = _ref.key,
      key = _ref$key === void 0 ? '' : _ref$key,
      _ref$isPriority = _ref.isPriority,
      isPriority = _ref$isPriority === void 0 ? false : _ref$isPriority,
      _ref$element = _ref.element,
      element = _ref$element === void 0 ? null : _ref$element;

  _classCallCheck(this, NavSibling);

  this.key = key;
  this.isPriority = isPriority;

  if (!isElement(element)) {
    console.warn('NavSibling expects element to be an instanceof HTMLElement');
    element = document.createElement('div');
  }

  this.element = element;
};

export default NavSibling;