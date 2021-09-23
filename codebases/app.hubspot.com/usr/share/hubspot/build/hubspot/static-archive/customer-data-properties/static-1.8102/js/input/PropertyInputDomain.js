'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import omit from 'transmute/omit';
import PropTypes from 'prop-types';
import { createRef, Component } from 'react';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UITextInput from 'UIComponents/input/UITextInput';
import UIGridItem from 'UIComponents/grid/UIGridItem';
import { domainContainsPath, isValidDomain, getDomainPathInfo } from 'customer-data-properties/validation/PropertyValidations';

var _UITextInput$propType = UITextInput.propTypes,
    __styled = _UITextInput$propType.styled,
    inputPropTypes = _objectWithoutProperties(_UITextInput$propType, ["styled"]);

var propTypes = Object.assign({
  autoFocus: PropTypes.bool,
  showError: PropTypes.bool,
  value: PropTypes.string
}, inputPropTypes);
var defaultProps = UITextInput.defaultProps;
var omitProps = omit(['actions', 'baseUrl', 'caretRenderer', 'isInline', 'multiCurrencyCurrencyCode', 'objectType', 'onCancel', 'onInvalidProperty', 'property', 'propertyIndex', 'readOnlySourceData', 'resolver', 'showError', 'subjectId', 'secondaryChanges', 'showPlaceholder', 'onSecondaryChange', 'onTracking', 'isRequired']);

var PropertyInputDomain = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputDomain, _Component);

  function PropertyInputDomain() {
    var _this;

    _classCallCheck(this, PropertyInputDomain);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputDomain).call(this));

    _this.handleBlur = function () {
      return _this.setState({
        hasBlurred: true
      });
    };

    _this.handleFocus = function () {
      return _this.setState({
        hasBlurred: false
      });
    };

    _this.state = {
      hasBlurred: false
    };
    _this.inputRef = /*#__PURE__*/createRef();
    return _this;
  }

  _createClass(PropertyInputDomain, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.autoFocus) {
        this.focus();
      }
    }
  }, {
    key: "focus",
    value: function focus() {
      (this.props.inputRef || this.inputRef).current.focus();
      (this.props.inputRef || this.inputRef).current.select();
    }
  }, {
    key: "getValue",
    value: function getValue() {
      var value = this.props.value;

      if (value == null) {
        return value;
      }

      return "" + value;
    }
  }, {
    key: "shouldShowError",
    value: function shouldShowError() {
      var hasBlurred = this.state.hasBlurred;
      var showError = this.props.showError;
      var propertyValue = this.getValue();
      return showError && hasBlurred && propertyValue && (!isValidDomain(propertyValue) || domainContainsPath(propertyValue));
    }
  }, {
    key: "getPathInfo",
    value: function getPathInfo() {
      var propertyValue = this.getValue();
      return propertyValue && getDomainPathInfo(propertyValue);
    }
  }, {
    key: "renderValidationError",
    value: function renderValidationError() {
      var propertyValue = this.getValue();

      if (!this.shouldShowError()) {
        return null;
      } // If a path exists, we need to display a special error asking the user to remove it


      var pathInfo = this.getPathInfo();

      if (pathInfo.path) {
        var domain = pathInfo.domain,
            path = pathInfo.path;
        return /*#__PURE__*/_jsx("div", {
          className: "is--text--error",
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "customerDataProperties.PropertyDomain.error.invalidPath",
            options: {
              domain: domain,
              path: path
            }
          })
        });
      }

      return /*#__PURE__*/_jsx("div", {
        className: "is--text--error",
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "customerDataProperties.PropertyDomain.error.invalidDomain",
          options: {
            domain: propertyValue
          }
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var transferableProps = omitProps(this.props);
      return /*#__PURE__*/_jsxs(UIGridItem, {
        size: {
          xs: 12
        },
        className: "p-x-0",
        children: [/*#__PURE__*/_jsx(UITextInput, Object.assign({}, transferableProps, {
          autoFocus: this.props.autoFocus,
          inputRef: this.props.inputRef || this.inputRef,
          value: this.getValue(),
          onBlur: this.handleBlur,
          onFocus: this.handleFocus
        })), this.renderValidationError()]
      });
    }
  }]);

  return PropertyInputDomain;
}(Component);

PropertyInputDomain.propTypes = propTypes;
PropertyInputDomain.defaultProps = defaultProps;
export default PropertyInputDomain;