'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import Controllable from '../decorators/Controllable';
import { OptionType } from '../types/OptionTypes';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import partial from 'react-utils/partial';
import SyntheticEvent from '../core/SyntheticEvent';
import UIButton from '../button/UIButton';
import UIButtonGroup from '../button/UIButtonGroup';
import UITooltip from '../tooltip/UITooltip';

var UIViewController = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIViewController, _PureComponent);

  function UIViewController() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UIViewController);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIViewController)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleChange = function (newValue, evt) {
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          value = _this$props.value;

      if (newValue === value) {
        return;
      }

      onChange(SyntheticEvent(newValue, evt));
    };

    return _this;
  }

  _createClass(UIViewController, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          __onChange = _this$props2.onChange,
          options = _this$props2.options,
          size = _this$props2.size,
          value = _this$props2.value,
          rest = _objectWithoutProperties(_this$props2, ["onChange", "options", "size", "value"]);

      return /*#__PURE__*/_jsx(UIButtonGroup, Object.assign({
        className: "private-button-select-group"
      }, rest, {
        role: "radiogroup",
        children: options.map(function (option) {
          var isActive = option.value === value;
          return /*#__PURE__*/_jsx(UITooltip, {
            title: option.title,
            children: /*#__PURE__*/_jsx(UIButton, {
              active: isActive,
              "aria-checked": isActive,
              className: "private-button-select-group__option",
              disabled: option.disabled,
              onClick: partial(_this2.handleChange, option.value),
              responsive: false,
              role: "radio",
              size: size,
              use: "tertiary-light",
              children: option.buttonText || option.text || option.value
            })
          }, option.value);
        })
      }));
    }
  }]);

  return UIViewController;
}(PureComponent);

UIViewController.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(OptionType.isRequired).isRequired,
  size: UIButton.propTypes.size,
  value: PropTypes.any
};
UIViewController.defaultProps = {
  size: 'small'
};
UIViewController.displayName = 'UIViewController';
export default Controllable(UIViewController);