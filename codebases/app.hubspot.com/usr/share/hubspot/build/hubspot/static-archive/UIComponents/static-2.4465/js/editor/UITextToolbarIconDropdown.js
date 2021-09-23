'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import UIAbstractIconDropdown from './abstract/UIAbstractIconDropdown';
import SimpleStyledClickable from './internal/SimpleStyledClickable';
import Controllable from '../decorators/Controllable';
import UITextToolbarIcon from '../editor/UITextToolbarIcon';
import { SingleValueType } from '../types/OptionTypes';
import UITooltip from '../tooltip/UITooltip';

var UITextToolbarIconDropdown = /*#__PURE__*/function (_Component) {
  _inherits(UITextToolbarIconDropdown, _Component);

  function UITextToolbarIconDropdown() {
    _classCallCheck(this, UITextToolbarIconDropdown);

    return _possibleConstructorReturn(this, _getPrototypeOf(UITextToolbarIconDropdown).apply(this, arguments));
  }

  _createClass(UITextToolbarIconDropdown, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          open = _this$props.open,
          options = _this$props.options,
          placement = _this$props.placement,
          tooltip = _this$props.tooltip,
          currentValue = _this$props.value,
          disabled = _this$props.disabled,
          rest = _objectWithoutProperties(_this$props, ["open", "options", "placement", "tooltip", "value", "disabled"]);

      var selectedOption = options.find(function (_ref) {
        var value = _ref.value;
        return value === currentValue;
      });
      var renderedIcon = selectedOption ? /*#__PURE__*/_jsx(UITextToolbarIcon, {
        name: selectedOption.icon,
        disabled: disabled
      }) : null;
      return /*#__PURE__*/_jsx(UITooltip, {
        open: open ? false : undefined,
        placement: placement,
        title: tooltip,
        disabled: disabled,
        children: /*#__PURE__*/_jsx(UIAbstractIconDropdown, Object.assign({
          Button: SimpleStyledClickable,
          buttonText: renderedIcon,
          open: open,
          options: options,
          value: currentValue,
          disabled: disabled
        }, rest))
      });
    }
  }]);

  return UITextToolbarIconDropdown;
}(Component);

UITextToolbarIconDropdown.propTypes = {
  defaultValue: SingleValueType,
  onChange: PropTypes.func,
  onOpenChange: PropTypes.func,
  open: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    icon: UITextToolbarIcon.propTypes.name,
    value: SingleValueType
  }).isRequired).isRequired,
  placement: UITooltip.propTypes.placement,
  tooltip: UITooltip.propTypes.title,
  value: SingleValueType,
  disabled: PropTypes.bool
};
UITextToolbarIconDropdown.defaultProps = {
  open: false,
  placement: 'bottom'
};
UITextToolbarIconDropdown.displayName = 'UITextToolbarIconDropdown';
export default Controllable(UITextToolbarIconDropdown, ['open', 'value']);