'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import omit from 'transmute/omit';
import { Seq } from 'immutable';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import * as PropertyValueDisplay from 'customer-data-property-utils/PropertyValueDisplay';
import UISelect from 'UIComponents/input/UISelect';
var propTypes = {
  defaultValue: PropTypes.node,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  property: PropTypes.instanceOf(PropertyRecord).isRequired,
  placeholder: PropTypes.node,
  value: PropTypes.node,
  isRequired: PropTypes.bool
};

var PropertyInputEnum = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputEnum, _Component);

  function PropertyInputEnum() {
    _classCallCheck(this, PropertyInputEnum);

    return _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputEnum).apply(this, arguments));
  }

  _createClass(PropertyInputEnum, [{
    key: "focus",
    value: function focus() {
      return this.refs.input.focus();
    }
  }, {
    key: "getPlaceholder",
    value: function getPlaceholder() {
      var _this$props = this.props,
          property = _this$props.property,
          placeholder = _this$props.placeholder;
      return placeholder !== undefined ? placeholder : property.placeholder;
    }
  }, {
    key: "getValue",
    value: function getValue() {
      var value = this.props.value || this.props.defaultValue;
      var result = String(value || '');
      return result;
    }
  }, {
    key: "render",
    value: function render() {
      var transferableProps = omit(['aria-required', 'baseUrl', 'data-field', 'error', 'id', 'isInline', 'objectType', 'onCancel', 'onFocus', 'onInvalidProperty', 'onKeyUp', 'onSecondaryChange', 'property', 'propertyIndex', 'readOnlySourceData', 'required', 'secondaryChanges', 'showError', 'subjectId', 'onTracking', 'isRequired', 'onPipelineChange'], Seq(this.props)).toJS();
      var options = this.props.isRequired ? PropertyValueDisplay.makeOptionsFromPropertyWithoutBlankOptions(this.props.property) : PropertyValueDisplay.makeOptionsFromProperty(this.props.property);
      return /*#__PURE__*/_jsx(UISelect, Object.assign({}, transferableProps, {
        options: options,
        placeholder: this.getPlaceholder(),
        ref: "input",
        value: this.getValue()
      }));
    }
  }]);

  return PropertyInputEnum;
}(Component);

export { PropertyInputEnum as default };
PropertyInputEnum.propTypes = propTypes;