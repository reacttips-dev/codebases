'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { USE_CLASSES } from '../button/ButtonConstants';
var CARET_CLASS_FOR_USE = {
  enclosed: 'private-dropdown__caret--enclosed',
  // special for UIDropdownTab
  form: 'private-dropdown__caret--form',
  'form-on-dark': 'private-dropdown__caret--form',
  'link-on-dark': 'private-dropdown__caret--link-on-dark'
};

var UIDropdownCaret = function UIDropdownCaret(_ref) {
  var className = _ref.className,
      hidden = _ref.hidden,
      use = _ref.use;
  var computedClassName = classNames("uiDropdown__buttonCaret private-dropdown__caret", className, CARET_CLASS_FOR_USE[use], hidden && 'private-dropdown__caret--hidden');
  return /*#__PURE__*/_jsx("span", {
    className: computedClassName
  });
};

UIDropdownCaret.propTypes = {
  hidden: PropTypes.bool,
  use: PropTypes.oneOf([].concat(_toConsumableArray(Object.keys(USE_CLASSES)), ['enclosed']))
};
UIDropdownCaret.displayName = 'UIDropdownCaret';
export default UIDropdownCaret;