'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { Component } from 'react';
import devLogger from 'react-utils/devLogger';
import Controllable from '../decorators/Controllable';
import UIDropdown from './UIDropdown';
import UITypeahead from '../typeahead/UITypeahead';
import { USE_CLASSES as BUTTON_USE_CLASSES } from '../button/ButtonConstants';
import lazyEval from '../utils/lazyEval';
import createLazyPropType from '../utils/propTypes/createLazyPropType';
import { OptionType, SingleValueType } from '../types/OptionTypes';

var UIDropdownSelect = /*#__PURE__*/function (_Component) {
  _inherits(UIDropdownSelect, _Component);

  function UIDropdownSelect() {
    _classCallCheck(this, UIDropdownSelect);

    return _possibleConstructorReturn(this, _getPrototypeOf(UIDropdownSelect).apply(this, arguments));
  }

  _createClass(UIDropdownSelect, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          onChange = _this$props.onChange,
          options = _this$props.options,
          placeholder = _this$props.placeholder,
          searchable = _this$props.searchable,
          onSearchChange = _this$props.onSearchChange,
          value = _this$props.value,
          rest = _objectWithoutProperties(_this$props, ["onChange", "options", "placeholder", "searchable", "onSearchChange", "value"]);

      var selectedOption;
      options.forEach(function (option) {
        if (option.value === value && !selectedOption) {
          selectedOption = option;
        }

        if (process.env.NODE_ENV !== 'production' && option.options) {
          devLogger.warn({
            message: 'UIDropdownSelect: The given `options` include groups, which are not supported. ' + 'Use `UISelect` instead.',
            key: 'UIDropdownSelect-groups',
            url: 'https://git.hubteam.com/HubSpot/UIComponents/issues/6467'
          });
        }
      });
      return /*#__PURE__*/_jsx(UIDropdown, Object.assign({}, rest, {
        buttonText: selectedOption ? selectedOption.text : lazyEval(placeholder),
        children: /*#__PURE__*/_jsx(UITypeahead, {
          resultsClassName: "p-y-0" // the default padding is redundant in a UIDropdown
          ,
          minimumSearchCount: searchable ? 0 : Infinity,
          onChange: onChange,
          onSearchChange: onSearchChange,
          options: options
        })
      }));
    }
  }]);

  return UIDropdownSelect;
}(Component);

UIDropdownSelect.propTypes = {
  buttonClassName: PropTypes.string,
  buttonUse: PropTypes.oneOf(Object.keys(BUTTON_USE_CLASSES)).isRequired,
  onChange: PropTypes.func,
  onSearchChange: PropTypes.func,
  options: PropTypes.arrayOf(OptionType).isRequired,
  placeholder: createLazyPropType(PropTypes.string).isRequired,
  searchable: PropTypes.bool.isRequired,
  value: SingleValueType
};
UIDropdownSelect.defaultProps = {
  buttonClassName: 'p-x-2',
  buttonUse: 'transparent',
  placeholder: function placeholder() {
    return I18n.text('salesUI.UIDropdownSelect.placeholder');
  },
  searchable: false
};
UIDropdownSelect.displayName = 'UIDropdownSelect';
export default Controllable(UIDropdownSelect, ['open', 'value']);