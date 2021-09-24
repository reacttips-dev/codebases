'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import HR from '../elements/HR';

var getClasses = function getClasses(className) {
  return classNames('private-dropdown-divider', className);
};

export default function UIDropdownDivider(_ref) {
  var className = _ref.className,
      rest = _objectWithoutProperties(_ref, ["className"]);

  return /*#__PURE__*/_jsx(HR, Object.assign({
    distance: "xs"
  }, rest, {
    className: getClasses(className)
  }));
}
UIDropdownDivider.displayName = 'UIDropdownDivider';