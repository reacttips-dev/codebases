'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { createElement as _createElement } from "react";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import range from '../../utils/underscore/range';
import PropTypes from 'prop-types';
import { Component } from 'react';
import partial from 'react-utils/partial';
import { callIfPossible } from '../../core/Functions';
import SyntheticEvent from '../../core/SyntheticEvent';
import { getTabIndex } from '../../utils/TabIndex';
import UIIconToggle from '../UIIconToggle';
import Controllable from '../../decorators/Controllable';

var UIAbstractRatingInput = /*#__PURE__*/function (_Component) {
  _inherits(UIAbstractRatingInput, _Component);

  function UIAbstractRatingInput() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UIAbstractRatingInput);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIAbstractRatingInput)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      focusValue: null
    };

    _this.handleChange = function (value) {
      if (_this.props.disabled || _this.props.readOnly) {
        return;
      }

      callIfPossible(_this.props.onChange, SyntheticEvent(value));
    };

    _this.handleKeyDown = function (evt) {
      var _this$props = _this.props,
          iconCount = _this$props.iconCount,
          value = _this$props.value;
      var nextValue = value || 0;

      if (evt.key === 'ArrowLeft') {
        nextValue = Math.floor(nextValue) <= 0 ? 0 : Math.ceil(nextValue) - 1;
      } else if (evt.key === 'ArrowRight') {
        nextValue = Math.ceil(nextValue) >= iconCount ? iconCount : Math.floor(nextValue) + 1;
      }

      _this.handleChange(nextValue);
    };

    _this.handleHover = function (value) {
      if (_this.props.disabled || _this.props.readOnly) {
        return;
      }

      _this.setState({
        focusValue: value
      });
    };

    return _this;
  }

  _createClass(UIAbstractRatingInput, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevState.focusValue !== this.state.focusValue) {
        callIfPossible(this.props.onHoveredValueChange, SyntheticEvent(this.state.focusValue));
      }
    }
  }, {
    key: "getPercentageFilled",
    value: function getPercentageFilled(index, value) {
      if (value == null) {
        return 0;
      }

      if (this.state.focusValue) {
        if (index <= this.state.focusValue) {
          return 100;
        }

        return 0;
      }

      if (index <= Math.floor(value)) {
        return 100;
      }

      if (index > Math.ceil(value)) {
        return 0;
      }

      return Math.round(value % 1 * 100);
    }
  }, {
    key: "getIsHighlighted",
    value: function getIsHighlighted(index, value) {
      if (this.state.focusValue !== null) {
        return index <= this.state.focusValue;
      }

      return index <= value;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          className = _this$props2.className,
          IconComponent = _this$props2.IconComponent,
          disabled = _this$props2.disabled,
          iconCount = _this$props2.iconCount,
          tabIndex = _this$props2.tabIndex,
          value = _this$props2.value,
          readOnly = _this$props2.readOnly,
          showPercentage = _this$props2.showPercentage,
          id = _this$props2.id,
          __onHoveredValueChange = _this$props2.onHoveredValueChange,
          rest = _objectWithoutProperties(_this$props2, ["className", "IconComponent", "disabled", "iconCount", "tabIndex", "value", "readOnly", "showPercentage", "id", "onHoveredValueChange"]),
          focusValue = this.state.focusValue;

      return /*#__PURE__*/_jsx("div", {
        id: id,
        "aria-disabled": disabled,
        "aria-valuemax": iconCount,
        "aria-valuemin": "0",
        "aria-valuenow": value || 0,
        "aria-valuetext": I18n.text('salesUI.UIIconRating.ariaValueText', {
          value: value || 0,
          maxValue: iconCount
        }),
        className: className,
        role: "slider",
        tabIndex: getTabIndex(disabled, tabIndex),
        onKeyDown: this.handleKeyDown,
        children: range(1, iconCount + 1).map(function (i) {
          return /*#__PURE__*/_createElement(UIIconToggle, Object.assign({}, rest, {
            key: i,
            index: i,
            onChange: partial(_this2.handleChange, i),
            onMouseEnter: partial(_this2.handleHover, i),
            onMouseLeave: partial(_this2.handleHover, null),
            "aria-label": "",
            checked: _this2.getIsHighlighted(i, value),
            readOnly: readOnly,
            percentFilled: showPercentage ? _this2.getPercentageFilled(i, value) : null,
            tabIndex: -1,
            IconComponent: IconComponent,
            active: value === i,
            disabled: disabled,
            focus: i === focusValue,
            hover: i <= focusValue
          }));
        })
      });
    }
  }]);

  return UIAbstractRatingInput;
}(Component);

UIAbstractRatingInput.propTypes = {
  IconComponent: PropTypes.elementType,
  disabled: PropTypes.bool,
  iconCount: PropTypes.number,
  onChange: PropTypes.func,
  onHoveredValueChange: PropTypes.func,
  readOnly: PropTypes.bool,
  showPercentage: PropTypes.bool.isRequired,
  value: PropTypes.number
};
UIAbstractRatingInput.defaultProps = {
  iconCount: 5,
  showPercentage: false
};
UIAbstractRatingInput.displayName = 'UIAbstractRatingInput';
export default Controllable(UIAbstractRatingInput);