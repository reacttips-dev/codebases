'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import UITooltip from 'UIComponents/tooltip/UITooltip';

var BulkActionButton = /*#__PURE__*/function (_PureComponent) {
  _inherits(BulkActionButton, _PureComponent);

  function BulkActionButton() {
    _classCallCheck(this, BulkActionButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(BulkActionButton).apply(this, arguments));
  }

  _createClass(BulkActionButton, [{
    key: "renderIcon",
    value: function renderIcon() {
      var _this$props = this.props,
          icon = _this$props.icon,
          options = _this$props.options;

      if (!icon || options.inDropdown) {
        return null;
      }

      return /*#__PURE__*/_jsx(UIIcon, {
        className: "m-right-1",
        name: icon
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          onClick = _this$props2.onClick,
          disabled = _this$props2.disabled,
          title = _this$props2.title,
          disabledTooltip = _this$props2.disabledTooltip;

      var button = /*#__PURE__*/_jsxs(UIButton, {
        "data-selenium-test": this.props['data-selenium-test'],
        "data-onboarding": this.props['data-onboarding'],
        disabled: disabled,
        onClick: onClick,
        use: "link",
        children: [this.renderIcon(), title]
      });

      if (disabled && disabledTooltip) {
        button = /*#__PURE__*/_jsx(UITooltip, {
          disabled: !disabled,
          placement: "bottom",
          title: disabledTooltip,
          children: button
        });
      }

      return button;
    }
  }]);

  return BulkActionButton;
}(PureComponent);

BulkActionButton.defaultProps = {
  disabled: false,
  options: {}
};
BulkActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  disabledTooltip: PropTypes.node,
  icon: PropTypes.string.isRequired,
  options: PropTypes.object,
  title: PropTypes.node.isRequired,
  'data-selenium-test': PropTypes.string,
  'data-onboarding': PropTypes.string
};
export default BulkActionButton;