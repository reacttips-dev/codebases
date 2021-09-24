'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import UIButtonWrapper from '../layout/UIButtonWrapper';
var ALIGNMENT_OPTIONS = {
  between: 'between',
  left: 'start',
  center: 'center',
  right: 'end'
};
export default function UIDialogFooter(_ref) {
  var align = _ref.align,
      children = _ref.children,
      className = _ref.className,
      rest = _objectWithoutProperties(_ref, ["align", "children", "className"]);

  return /*#__PURE__*/_jsx("footer", Object.assign({}, rest, {
    className: classNames("private-modal__footer uiDialogFooter", className),
    children: /*#__PURE__*/_jsx(UIButtonWrapper, {
      justify: ALIGNMENT_OPTIONS[align],
      children: children
    })
  }));
}
UIDialogFooter.propTypes = {
  align: PropTypes.oneOf(['left', 'center', 'right', 'between']).isRequired,
  children: PropTypes.node
};
UIDialogFooter.defaultProps = {
  align: 'left'
};
UIDialogFooter.displayName = 'UIDialogFooter';