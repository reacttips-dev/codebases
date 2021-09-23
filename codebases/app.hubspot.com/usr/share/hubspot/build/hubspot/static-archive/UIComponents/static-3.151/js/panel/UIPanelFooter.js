'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import UIDialogFooter from '../dialog/UIDialogFooter';
export default function UIPanelFooter(_ref) {
  var className = _ref.className,
      rest = _objectWithoutProperties(_ref, ["className"]);

  return /*#__PURE__*/_jsx(UIDialogFooter, Object.assign({}, rest, {
    className: classNames('private-panel__footer', className),
    layout: "default"
  }));
}
UIPanelFooter.propTypes = Object.assign({}, UIDialogFooter.propTypes, {
  children: PropTypes.node
});
UIPanelFooter.defaultProps = Object.assign({}, UIDialogFooter.defaultProps);
UIPanelFooter.displayName = 'UIPanelFooter';