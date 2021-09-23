'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { createRef, Component } from 'react';
import { isKnownGuid, getGuidLabel } from 'reporting-data/lib/guids';
import FormattedMessage from 'I18n/components/FormattedMessage';
import omit from 'transmute/omit';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';
import UITextInput from 'UIComponents/input/UITextInput';
import refObject from 'UIComponents/utils/propTypes/refObject';
var getTransferableProps = omit(['actions', 'baseUrl', 'isInline', 'InputComponent', 'objectType', 'onCancel', 'onInvalidProperty', 'onSecondaryChange', 'options', 'property', 'propertyIndex', 'readOnlySourceData', 'resize', 'resolver', 'secondaryChanges', 'showError', 'subjectId', 'wrappers', 'onTracking', 'isRequired']);
var propTypes = {
  autoFocus: PropTypes.bool,
  inputRef: refObject,
  displayValue: PropTypes.string,
  property: PropTypes.instanceOf(PropertyRecord).isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

var PropertyInputKnownGuid = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputKnownGuid, _Component);

  function PropertyInputKnownGuid() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, PropertyInputKnownGuid);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PropertyInputKnownGuid)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.inputRef = /*#__PURE__*/createRef();
    return _this;
  }

  _createClass(PropertyInputKnownGuid, [{
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
    }
  }, {
    key: "getDisplayValue",
    value: function getDisplayValue() {
      var value = this.props.value;

      if (!value) {
        return value;
      }

      if (isKnownGuid(value)) {
        return getGuidLabel(value);
      }

      return value;
    }
  }, {
    key: "renderInternalValueTooltipIcon",
    value: function renderInternalValueTooltipIcon() {
      var value = this.props.value;

      if (!value || !isKnownGuid(value)) {
        return null;
      }

      var tooltipMessage = /*#__PURE__*/_jsx(FormattedMessage, {
        message: "recordProperties.original_value",
        options: {
          originalValue: value
        }
      });

      return /*#__PURE__*/_jsx(UIHelpIcon, {
        title: tooltipMessage,
        tooltipPlacement: "top right",
        className: "p-top-1 p-right-2"
      });
    }
  }, {
    key: "renderTextInput",
    value: function renderTextInput() {
      return /*#__PURE__*/_jsx(UITextInput, Object.assign({}, getTransferableProps(this.props), {
        readOnly: true,
        inputRef: this.props.inputRef || this.inputRef,
        value: this.getDisplayValue()
      }));
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsxs(UIFlex, {
        align: "center",
        children: [this.renderInternalValueTooltipIcon(), this.renderTextInput()]
      });
    }
  }]);

  return PropertyInputKnownGuid;
}(Component);

export { PropertyInputKnownGuid as default };
PropertyInputKnownGuid.propTypes = propTypes;