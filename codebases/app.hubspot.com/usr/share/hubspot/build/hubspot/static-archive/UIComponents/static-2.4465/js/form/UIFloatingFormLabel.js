'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import UIFormLabel from '../form/UIFormLabel';
import UITruncateString from '../text/UITruncateString';
import UITooltip from '../tooltip/UITooltip';
export default function UIFloatingFormLabel(_ref) {
  var children = _ref.children,
      className = _ref.className,
      floatActive = _ref.floatActive,
      sibling = _ref.sibling,
      tooltip = _ref.tooltip,
      tooltipProps = _ref.tooltipProps,
      rest = _objectWithoutProperties(_ref, ["children", "className", "floatActive", "sibling", "tooltip", "tooltipProps"]);

  var computedClassName = classNames(className, 'private-form__label--floating', !floatActive && 'private-form__label--floating-as-placeholder');

  if (tooltip) {
    return /*#__PURE__*/_jsx(UIFormLabel, Object.assign({}, rest, {
      className: computedClassName,
      children: /*#__PURE__*/_jsx(UITooltip, Object.assign({}, tooltipProps, {
        title: tooltip,
        children: /*#__PURE__*/_jsx(UITruncateString, {
          useFlex: true,
          fixedChildren: sibling,
          tooltip: false,
          children: children
        })
      }))
    }));
  }

  return /*#__PURE__*/_jsx(UIFormLabel, Object.assign({}, rest, {
    className: computedClassName,
    children: /*#__PURE__*/_jsx(UITruncateString, {
      useFlex: true,
      fixedChildren: sibling,
      children: children
    })
  }));
}
UIFloatingFormLabel.propTypes = Object.assign({}, UIFormLabel.propTypes, {
  children: PropTypes.node.isRequired,
  floatActive: PropTypes.bool.isRequired,
  sibling: PropTypes.node,
  tooltip: PropTypes.node,
  tooltipProps: PropTypes.object
});
UIFloatingFormLabel.defaultProps = Object.assign({}, UIFormLabel.defaultProps, {
  floatActive: false
});
UIFloatingFormLabel.displayName = 'UIFloatingFormLabel';