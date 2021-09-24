'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import styled from 'styled-components';
import SimpleStyledCaret from './internal/SimpleStyledCaret';
import SimpleStyledClickable from './internal/SimpleStyledClickable';
import { rgba } from '../core/Color';
import { callIfPossible } from '../core/Functions';
import SyntheticEvent from '../core/SyntheticEvent';
import Controllable from '../decorators/Controllable';
import UIAbstractDropdown from '../dropdown/abstract/UIAbstractDropdown';
import UITextToolbarIcon from '../editor/UITextToolbarIcon';
import UITooltip from '../tooltip/UITooltip';
import { propType as colorPropType } from '../utils/propTypes/color';
var StyledTextToolbarIcon = styled(function (props) {
  var __currentColor = props.currentColor,
      __opacity = props.opacity,
      rest = _objectWithoutProperties(props, ["currentColor", "opacity"]);

  return /*#__PURE__*/_jsx(UITextToolbarIcon, Object.assign({}, rest, {
    size: 13
  }));
}).withConfig({
  displayName: "UITextToolbarColorDropdown__StyledTextToolbarIcon",
  componentId: "sc-16a18t8-0"
})(["border-bottom:2px solid ", ";line-height:1;padding-bottom:1px;position:relative;transform:translateY(-2px);"], function (_ref) {
  var currentColor = _ref.currentColor,
      opacity = _ref.opacity;
  return rgba(currentColor, opacity);
});
var COLORPICKER_SIMPLE_MODE = 'simple';

var UITextToolbarColorDropdown = /*#__PURE__*/function (_Component) {
  _inherits(UITextToolbarColorDropdown, _Component);

  function UITextToolbarColorDropdown(props) {
    var _this;

    _classCallCheck(this, UITextToolbarColorDropdown);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UITextToolbarColorDropdown).call(this, props));

    _this.handleOpenChange = function (evt) {
      var onOpenChange = _this.props.onOpenChange;

      if (evt.target.value === true) {
        _this.setState({
          pickerMode: COLORPICKER_SIMPLE_MODE
        });
      }

      onOpenChange(evt);
    };

    _this.handleColorChange = function (update) {
      var _this$props = _this.props,
          onColorChange = _this$props.onColorChange,
          onOpenChange = _this$props.onOpenChange;
      var pickerMode = _this.state.pickerMode;
      onColorChange(SyntheticEvent(update));

      if (pickerMode === COLORPICKER_SIMPLE_MODE) {
        onOpenChange(SyntheticEvent(false));
      }
    };

    _this.handlePickerModeChange = function (evt) {
      var onPickerModeChange = _this.props.onPickerModeChange;

      _this.setState({
        pickerMode: evt.target.value
      });

      callIfPossible(onPickerModeChange, evt);
    };

    _this.state = {
      pickerMode: COLORPICKER_SIMPLE_MODE
    };
    return _this;
  }

  _createClass(UITextToolbarColorDropdown, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          currentColor = _this$props2.color,
          icon = _this$props2.icon,
          menuWidth = _this$props2.menuWidth,
          __onColorChange = _this$props2.onColorChange,
          __onOpenChange = _this$props2.onOpenChange,
          __onPickerModeChange = _this$props2.onPickerModeChange,
          onResetClick = _this$props2.onResetClick,
          open = _this$props2.open,
          tooltipPlacement = _this$props2.tooltipPlacement,
          tooltip = _this$props2.tooltip,
          DropdownContent = _this$props2.DropdownContent,
          disabled = _this$props2.disabled,
          rest = _objectWithoutProperties(_this$props2, ["color", "icon", "menuWidth", "onColorChange", "onOpenChange", "onPickerModeChange", "onResetClick", "open", "tooltipPlacement", "tooltip", "DropdownContent", "disabled"]);

      var pickerMode = this.state.pickerMode;
      var color = currentColor.color,
          alpha = currentColor.alpha;
      var opacity = alpha != null ? alpha / 100 : 1;

      var renderedIcon = /*#__PURE__*/_jsx(StyledTextToolbarIcon, {
        currentColor: color,
        opacity: opacity,
        name: icon,
        disabled: disabled
      });

      return /*#__PURE__*/_jsx(UITooltip, {
        open: open ? false : undefined,
        placement: tooltipPlacement,
        title: tooltip,
        disabled: disabled,
        children: /*#__PURE__*/_jsx(UIAbstractDropdown, Object.assign({
          Button: SimpleStyledClickable,
          buttonText: renderedIcon,
          caretRenderer: /*#__PURE__*/_jsx(SimpleStyledCaret, {
            className: "m-x-1"
          }),
          menuWidth: menuWidth,
          onOpenChange: this.handleOpenChange,
          open: open,
          disabled: disabled
        }, rest, {
          children: /*#__PURE__*/_jsx(DropdownContent, {
            alpha: alpha,
            color: color,
            pickerMode: pickerMode,
            onChange: this.handleColorChange,
            onOpenChange: this.handleOpenChange,
            onPickerModeChange: this.handlePickerModeChange,
            onResetClick: onResetClick
          })
        }))
      });
    }
  }]);

  return UITextToolbarColorDropdown;
}(Component);

UITextToolbarColorDropdown.propTypes = {
  color: PropTypes.shape({
    color: colorPropType,
    alpha: PropTypes.number
  }),
  DropdownContent: PropTypes.elementType.isRequired,
  icon: UITextToolbarIcon.propTypes.name,
  menuWidth: UIAbstractDropdown.propTypes.menuWidth,
  onColorChange: PropTypes.func,
  onOpenChange: PropTypes.func,
  onPickerModeChange: PropTypes.func,
  onResetClick: PropTypes.func,
  open: PropTypes.bool.isRequired,
  tooltipPlacement: UITooltip.propTypes.placement,
  tooltip: UITooltip.propTypes.title,
  disabled: PropTypes.bool
};
UITextToolbarColorDropdown.defaultProps = {
  menuWidth: UIAbstractDropdown.defaultProps.menuWidth,
  open: false,
  tooltipPlacement: 'bottom'
};
UITextToolbarColorDropdown.displayName = 'UITextToolbarColorDropdown';
export default Controllable(UITextToolbarColorDropdown, ['open', 'color']);