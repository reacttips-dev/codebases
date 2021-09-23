'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
import PropTypes from 'prop-types';
import { Component } from 'react';
import classNames from 'classnames';
import memoize from 'react-utils/memoize';
import SimpleStyledCaret from '../internal/SimpleStyledCaret';
import SimpleStyledClickable from '../internal/SimpleStyledClickable';
import UIIconButton from '../../button/UIIconButton';
import SyntheticEvent from '../../core/SyntheticEvent';
import UIAbstractDropdown from '../../dropdown/abstract/UIAbstractDropdown';
import UITextToolbarIcon from '../../editor/UITextToolbarIcon';
import UIList from '../../list/UIList';
import { SingleValueType } from '../../types/OptionTypes';
import { moveFocusToNext } from '../../utils/Dom';
import { uniqueId } from '../../utils/underscore';

var getDropdownClassName = function getDropdownClassName(dropdownClassName) {
  return classNames('private-dropdown--list', dropdownClassName);
};

var UIAbstractIconDropdown = /*#__PURE__*/function (_Component) {
  _inherits(UIAbstractIconDropdown, _Component);

  function UIAbstractIconDropdown(props) {
    var _this;

    _classCallCheck(this, UIAbstractIconDropdown);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIAbstractIconDropdown).call(this, props));

    _this.handleKeyDown = function (evt) {
      var key = evt.key;
      var open = _this.props.open;
      if (!open) return;

      if (key === 'ArrowDown' || key === 'ArrowUp') {
        var menu = document.getElementById(_this._id);
        if (!menu) return;

        if (moveFocusToNext('li', menu, key === 'ArrowUp')) {
          evt.preventDefault();
        }

        evt.stopPropagation();
      }
    };

    _this._id = "icon-dropdown-" + uniqueId();
    _this.getHandleChange = memoize(_this.getHandleChange.bind(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(UIAbstractIconDropdown, [{
    key: "getHandleChange",
    value: function getHandleChange(value) {
      var _this2 = this;

      var event = SyntheticEvent(value);
      return function () {
        var _this2$props = _this2.props,
            onOpenChange = _this2$props.onOpenChange,
            onChange = _this2$props.onChange,
            open = _this2$props.open;
        onChange(event);
        onOpenChange(SyntheticEvent(!open));
      };
    }
  }, {
    key: "renderOptions",
    value: function renderOptions(options) {
      var _this3 = this;

      return options.map(function (_ref) {
        var icon = _ref.icon,
            value = _ref.value,
            rest = _objectWithoutProperties(_ref, ["icon", "value"]);

        return /*#__PURE__*/_createElement(UIIconButton, Object.assign({}, rest, {
          key: icon,
          onClick: _this3.getHandleChange(value),
          placement: "right",
          use: "transparent"
        }), /*#__PURE__*/_jsx(UITextToolbarIcon, {
          name: icon
        }));
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          dropdownClassName = _this$props.dropdownClassName,
          open = _this$props.open,
          options = _this$props.options,
          __value = _this$props.value,
          rest = _objectWithoutProperties(_this$props, ["dropdownClassName", "open", "options", "value"]);

      var computedDropdownClassName = getDropdownClassName(dropdownClassName);
      return /*#__PURE__*/_jsx(UIAbstractDropdown, Object.assign({}, rest, {
        Button: SimpleStyledClickable,
        caretRenderer: /*#__PURE__*/_jsx(SimpleStyledCaret, {}),
        dropdownClassName: computedDropdownClassName,
        menuWidth: 50,
        open: open,
        onKeyDown: this.handleKeyDown,
        children: /*#__PURE__*/_jsx(UIList, {
          id: this._id,
          children: this.renderOptions(options)
        })
      }));
    }
  }]);

  return UIAbstractIconDropdown;
}(Component);

UIAbstractIconDropdown.propTypes = Object.assign({}, UIAbstractDropdown.propTypes, {
  defaultValue: SingleValueType,
  dropdownClassName: PropTypes.string,
  onChange: PropTypes.func,
  onOpenChange: PropTypes.func,
  open: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    icon: UITextToolbarIcon.propTypes.name,
    value: SingleValueType
  }).isRequired).isRequired,
  value: SingleValueType
});
UIAbstractIconDropdown.defaultProps = Object.assign({}, UIAbstractDropdown.defaultProps, {
  open: false
});
UIAbstractIconDropdown.displayName = 'UIAbstractIconDropdown';
export default UIAbstractIconDropdown;