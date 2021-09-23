'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import UIAbstractIconDropdown from './abstract/UIAbstractIconDropdown';
import UITextToolbarButton from './UITextToolbarButton';
import UITextToolbarIcon from './UITextToolbarIcon';
import Controllable from '../decorators/Controllable';
import UIButtonGroup from '../button/UIButtonGroup';
import UITooltip from '../tooltip/UITooltip';
var StyledButtonGroup = styled(UIButtonGroup).withConfig({
  displayName: "UITextToolbarSplitSelect__StyledButtonGroup",
  componentId: "sc-1ez2of6-0"
})(["& > *[aria-disabled='true']{border-color:transparent !important;}"]);

var UITextToolbarSplitSelect = /*#__PURE__*/function (_Component) {
  _inherits(UITextToolbarSplitSelect, _Component);

  function UITextToolbarSplitSelect() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UITextToolbarSplitSelect);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UITextToolbarSplitSelect)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.refCallback = function (element) {
      _this._popoverTarget = findDOMNode(element);
    };

    return _this;
  }

  _createClass(UITextToolbarSplitSelect, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          active = _this$props.active,
          open = _this$props.open,
          options = _this$props.options,
          onButtonClick = _this$props.onButtonClick,
          placement = _this$props.placement,
          tooltip = _this$props.tooltip,
          value = _this$props.value,
          splitButtonTestId = _this$props.splitButtonTestId,
          disabled = _this$props.disabled,
          rest = _objectWithoutProperties(_this$props, ["active", "open", "options", "onButtonClick", "placement", "tooltip", "value", "splitButtonTestId", "disabled"]);

      var selectedOption = options.find(function (_ref) {
        var val = _ref.value;
        return val === value;
      });
      var renderedIcon = selectedOption ? /*#__PURE__*/_jsx(UITextToolbarIcon, {
        disabled: disabled,
        name: selectedOption.icon
      }) : null;
      var popoverProps = {
        target: this._popoverTarget
      };
      return /*#__PURE__*/_jsx(UITooltip, {
        open: open ? false : undefined,
        placement: placement,
        title: tooltip,
        disabled: disabled,
        children: /*#__PURE__*/_jsxs(StyledButtonGroup, {
          disabled: disabled,
          children: [/*#__PURE__*/_jsx(UITextToolbarButton, {
            "data-test-id": splitButtonTestId,
            hovered: open ? true : undefined,
            onClick: onButtonClick,
            ref: this.refCallback,
            selected: active,
            disabled: disabled,
            children: renderedIcon
          }), /*#__PURE__*/_jsx(UIAbstractIconDropdown, Object.assign({
            open: open,
            options: options,
            popoverProps: popoverProps,
            value: value,
            disabled: disabled
          }, rest))]
        })
      });
    }
  }]);

  return UITextToolbarSplitSelect;
}(Component);

UITextToolbarSplitSelect.propTypes = Object.assign({}, UIAbstractIconDropdown.propTypes, {
  active: PropTypes.bool,
  onButtonClick: PropTypes.func,
  placement: UITooltip.propTypes.placement,
  tooltip: UITooltip.propTypes.title,
  splitButtonTestId: PropTypes.string
});
UITextToolbarSplitSelect.defaultProps = Object.assign({}, UIAbstractIconDropdown.defaultProps, {
  active: false,
  placement: 'bottom'
});
UITextToolbarSplitSelect.displayName = 'UITextToolbarSplitSelect';
export default Controllable(UITextToolbarSplitSelect, ['open', 'value']);