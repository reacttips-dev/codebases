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
import Small from 'UIComponents/elements/Small';
import UIIconButton from 'UIComponents/button/UIIconButton';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIIcon from 'UIComponents/icon/UIIcon';
import emptyFunction from 'react-utils/emptyFunction';
var MIN_PHONE_LENGTH = 3;

var PropertyInputPhone = /*#__PURE__*/function (_PureComponent) {
  _inherits(PropertyInputPhone, _PureComponent);

  function PropertyInputPhone() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, PropertyInputPhone);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PropertyInputPhone)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      phoneNumber: _this.props.phoneNumber,
      extension: _this.props.extension
    };

    _this.handleNumberChange = function (_ref) {
      var phoneNumber = _ref.phoneNumber,
          extension = _ref.extension;

      _this.setState({
        phoneNumber: phoneNumber,
        extension: extension
      });

      _this.props.onChange(phoneNumber, extension);
    };

    _this.renderInvalidNumberHelp = function () {
      var errorMessage = _this.props.errorMessage;
      var phoneNumber = _this.state.phoneNumber;

      if (!errorMessage || !(phoneNumber && phoneNumber.length > MIN_PHONE_LENGTH)) {
        return null;
      }

      if (typeof errorMessage === 'string') {
        errorMessage = /*#__PURE__*/_jsx(Small, {
          use: "error",
          children: errorMessage
        });
      }

      return errorMessage;
    };

    return _this;
  }

  _createClass(PropertyInputPhone, [{
    key: "render",
    value: function render() {
      var showDelete = this.props.showDelete;
      var _this$state = this.state,
          phoneNumber = _this$state.phoneNumber,
          extension = _this$state.extension;
      return /*#__PURE__*/_jsxs("div", {
        "data-selenium-test": "PropertyInputPhone__input-container",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "display-flex",
          children: [/*#__PURE__*/_jsx(PhoneNumberInput, {
            value: phoneNumber,
            extensionValue: extension,
            phoneInputProps: {
              autoFocus: true
            },
            onChange: this.handleNumberChange
          }), showDelete && /*#__PURE__*/_jsx(UIIconButton, {
            use: "transparent",
            onClick: this.props.onDelete,
            tooltip: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "customerDataProperties.PropertyInputPhone.delete"
            }),
            children: /*#__PURE__*/_jsx(UIIcon, {
              name: "delete"
            })
          })]
        }), this.renderInvalidNumberHelp()]
      });
    }
  }]);

  return PropertyInputPhone;
}(PureComponent);

PropertyInputPhone.propTypes = Object.assign({}, UITextInput.PropTypes, {
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  phoneNumber: PropTypes.string,
  extension: PropTypes.string,
  showDelete: PropTypes.bool.isRequired
});
PropertyInputPhone.defaultProps = Object.assign({}, UITextInput.defaultProps, {
  onDelete: emptyFunction
});
export default PropertyInputPhone;