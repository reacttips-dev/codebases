'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import PropertyInputText from 'customer-data-properties/input/PropertyInputText';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UIFormControl from 'UIComponents/form/UIFormControl';

var PropertyInputName = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputName, _Component);

  function PropertyInputName() {
    _classCallCheck(this, PropertyInputName);

    return _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputName).apply(this, arguments));
  }

  _createClass(PropertyInputName, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.autoFocus) {
        this.focus();
      }
    }
  }, {
    key: "focus",
    value: function focus() {
      this.inputText.focus();
    }
  }, {
    key: "getErrorKey",
    value: function getErrorKey() {
      var value = this.props.value;

      if (value && value.includes('"')) {
        return 'customerDataProperties.PropertyInputText.error.nameContainsDoubleQuote';
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var errorKey = this.getErrorKey();
      return /*#__PURE__*/_jsx(UIFormControl, {
        error: !!errorKey,
        validationMessage: errorKey && /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: errorKey
        }),
        children: /*#__PURE__*/_jsx(PropertyInputText, Object.assign({}, this.props, {
          ref: function ref(inputText) {
            _this.inputText = inputText;
          }
        }))
      });
    }
  }]);

  return PropertyInputName;
}(Component);

PropertyInputName.propTypes = {
  autoFocus: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])
};
export default PropertyInputName;