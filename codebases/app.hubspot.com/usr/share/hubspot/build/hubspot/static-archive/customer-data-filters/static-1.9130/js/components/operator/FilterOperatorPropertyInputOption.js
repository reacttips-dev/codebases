'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import { Component } from 'react';
import UITooltip from 'UIComponents/tooltip/UITooltip';

var FilterOperatorPropertyInputOption = /*#__PURE__*/function (_Component) {
  _inherits(FilterOperatorPropertyInputOption, _Component);

  function FilterOperatorPropertyInputOption() {
    _classCallCheck(this, FilterOperatorPropertyInputOption);

    return _possibleConstructorReturn(this, _getPrototypeOf(FilterOperatorPropertyInputOption).apply(this, arguments));
  }

  _createClass(FilterOperatorPropertyInputOption, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          option = _this$props.option,
          rest = _objectWithoutProperties(_this$props, ["children", "option"]);

      return /*#__PURE__*/_jsx("span", Object.assign({}, rest, {
        children: /*#__PURE__*/_jsx(UITooltip, {
          disabled: !option.disabled,
          placement: "right",
          title: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "customerDataFilters.FilterOperatorPropertyInput.titleCantCompareToItself"
          }),
          children: children
        })
      }));
    }
  }]);

  return FilterOperatorPropertyInputOption;
}(Component);

export default FilterOperatorPropertyInputOption;