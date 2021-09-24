'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FilterOperatorErrorType from 'customer-data-filters/components/propTypes/FilterOperatorErrorType';
import FilterOperatorType from 'customer-data-filters/components/propTypes/FilterOperatorType';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { Component } from 'react';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIInputGroup from 'UIComponents/form/UIInputGroup';
import UISelect from 'UIComponents/input/UISelect';
import UITextInput from 'UIComponents/input/UITextInput';
import memoizeLast from 'transmute/memoizeLast';

var getProtocol = function getProtocol(str) {
  if (/^((http):\/\/)/i.test(str)) {
    return 'http://';
  } else if (/^((https):\/\/)/i.test(str)) {
    return 'https://';
  }

  return undefined;
};

var getDisplayValue = memoizeLast(function () {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return str.replace(/^((http|https):\/\/)*/i, '');
});
var defaultProtocolValue = 'https://';

var FilterOperatorUrlInput = /*#__PURE__*/function (_Component) {
  _inherits(FilterOperatorUrlInput, _Component);

  function FilterOperatorUrlInput(props) {
    var _this;

    _classCallCheck(this, FilterOperatorUrlInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterOperatorUrlInput).call(this, props));

    _this.getNextValue = function (str, prevProtocol) {
      var nextProtocol = getProtocol(str) || prevProtocol || defaultProtocolValue;
      var nextDisplayValue = getDisplayValue(str);

      _this.setState({
        protocol: nextProtocol
      });

      return "" + nextProtocol + nextDisplayValue;
    };

    _this.updateValue = function (currentValue) {
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          value = _this$props.value;
      var protocol = _this.state.protocol;

      var nextValue = _this.getNextValue(currentValue, protocol);

      return onChange(SyntheticEvent(value.set('value', nextValue)));
    };

    _this.handleProtocolChange = function (evt) {
      var _this$props2 = _this.props,
          onChange = _this$props2.onChange,
          value = _this$props2.value;
      var url = "" + evt.target.value + getDisplayValue(value.get('value'));
      onChange(SyntheticEvent(value.set('value', url)));

      _this.setState({
        protocol: evt.target.value
      });
    };

    _this.handleDomainChange = function (evt) {
      var value = evt.target.value;
      return _this.updateValue(value);
    };

    var initialValue = props.value.get('value');
    _this.state = {
      protocol: initialValue ? getProtocol(initialValue) : defaultProtocolValue
    };
    return _this;
  }

  _createClass(FilterOperatorUrlInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var initialValue = this.props.value.get('value');

      if (getDisplayValue(initialValue)) {
        this.updateValue(initialValue);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          className = _this$props3.className,
          error = _this$props3.error,
          value = _this$props3.value;
      var protocol = this.state.protocol;
      var isError = error.get('error');
      var errorMessage = error.get('message');
      return /*#__PURE__*/_jsxs(UIInputGroup, {
        className: className,
        required: true,
        use: "itemLeft",
        children: [/*#__PURE__*/_jsx(UIFormControl, {
          error: isError,
          validationMessage: isError ? errorMessage : null,
          children: /*#__PURE__*/_jsx(UISelect, {
            defaultValue: defaultProtocolValue,
            onChange: this.handleProtocolChange,
            options: [{
              text: 'https://',
              value: 'https://'
            }, {
              text: 'http://',
              value: 'http://'
            }],
            placeholder: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "customerDataFilters.FilterOperatorUrlInput.protocol.placeholder"
            }),
            value: protocol
          })
        }), /*#__PURE__*/_jsx(UIFormControl, {
          children: /*#__PURE__*/_jsx(UITextInput, {
            onChange: this.handleDomainChange,
            value: getDisplayValue(value.get('value'))
          })
        })]
      });
    }
  }]);

  return FilterOperatorUrlInput;
}(Component);

FilterOperatorUrlInput.propTypes = {
  className: PropTypes.string,
  error: FilterOperatorErrorType.isRequired,
  onChange: PropTypes.func.isRequired,
  value: FilterOperatorType.isRequired
};
export default FilterOperatorUrlInput;