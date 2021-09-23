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
import UITextInput from 'UIComponents/input/UITextInput';
import PhoneNumberInput from 'ui-addon-i18n/components/PhoneNumberInput';
import emptyFunction from 'react-utils/emptyFunction';
import Small from 'UIComponents/elements/Small';
var MIN_PHONE_LENGTH = 3;

var PropertyInputPhone = /*#__PURE__*/function (_PureComponent) {
  _inherits(PropertyInputPhone, _PureComponent);

  function PropertyInputPhone(props) {
    var _this;

    _classCallCheck(this, PropertyInputPhone);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputPhone).call(this));

    _this.handleNumberChange = function (_ref) {
      var phoneNumber = _ref.phoneNumber,
          extension = _ref.extension,
          country = _ref.country;

      _this.setState({
        phoneNumber: phoneNumber,
        extension: extension
      }, function () {
        _this.props.onChange(phoneNumber, extension, country);
      });
    };

    _this.state = {
      phoneNumber: props.phoneNumber || '',
      extension: props.extension || ''
    };
    return _this;
  }

  _createClass(PropertyInputPhone, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props = this.props,
          propertyName = _this$props.propertyName,
          phoneNumber = _this$props.phoneNumber,
          extension = _this$props.extension;

      if (propertyName !== prevProps.propertyName) {
        this.setState({
          phoneNumber: phoneNumber || '',
          extension: extension || ''
        });
      }
    }
  }, {
    key: "renderInvalidNumberHelp",
    value: function renderInvalidNumberHelp() {
      var errorMessage = this.props.errorMessage;
      var phoneNumber = this.state.phoneNumber;

      if (!errorMessage || !(phoneNumber.length > MIN_PHONE_LENGTH)) {
        return null;
      }

      if (typeof errorMessage === 'string') {
        errorMessage = /*#__PURE__*/_jsx(Small, {
          use: "error",
          children: errorMessage
        });
      }

      return errorMessage;
    }
  }, {
    key: "render",
    value: function render() {
      var disabled = this.props.disabled;
      var _this$state = this.state,
          extension = _this$state.extension,
          phoneNumber = _this$state.phoneNumber;
      return /*#__PURE__*/_jsxs("div", {
        className: "phone-input",
        "data-selenium-test": "PropertyInputPhone__input-container",
        children: [/*#__PURE__*/_jsx("div", {
          className: "display-flex phone-input-with-extension",
          children: /*#__PURE__*/_jsx(PhoneNumberInput, {
            value: phoneNumber,
            extensionValue: extension,
            phoneInputProps: {
              disabled: disabled,
              autoFocus: true
            },
            onChange: this.handleNumberChange,
            countrySelectProps: {
              disabled: disabled
            },
            extensionInputProps: {
              disabled: disabled
            }
          })
        }), this.renderInvalidNumberHelp()]
      });
    }
  }]);

  return PropertyInputPhone;
}(PureComponent);

PropertyInputPhone.propTypes = Object.assign({}, UITextInput.PropTypes, {
  onChange: PropTypes.func.isRequired,
  propertyName: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string,
  extension: PropTypes.string,
  disabled: PropTypes.bool
});
PropertyInputPhone.defaultProps = Object.assign({}, UITextInput.defaultProps, {
  extension: '',
  phoneNumber: '',
  onBlur: emptyFunction,
  disabled: false
});
export { PropertyInputPhone as default };