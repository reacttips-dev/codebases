'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import omit from '../utils/underscore/omit';
import classNames from 'classnames';
import UIAlert from '../alert/UIAlert';
export default function UIBanner(_ref) {
  var className = _ref.className,
      children = _ref.children,
      other = _objectWithoutProperties(_ref, ["className", "children"]);

  return /*#__PURE__*/_jsx(UIAlert, Object.assign({}, other, {
    className: classNames('private-alert--banner', className),
    children: children
  }));
}
UIBanner.propTypes = Object.assign({}, omit(UIAlert.propTypes, ['type']));
UIBanner.defaultProps = Object.assign({}, UIAlert.defaultProps);
UIBanner.displayName = 'UIBanner';