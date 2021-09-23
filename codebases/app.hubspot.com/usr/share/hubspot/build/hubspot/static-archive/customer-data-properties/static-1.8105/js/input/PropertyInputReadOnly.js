'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import omit from 'transmute/omit';
import { isEnum, isMultiple, isMultienum, isTextarea, isSingleLineText } from 'customer-data-objects/property/PropertyIdentifier';
import { getDisplayedValue } from 'customer-data-property-utils/PropertyValueDisplay';
import { isValidPropertyValue } from 'customer-data-properties/validation/PropertyValidations';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import PropTypes from 'prop-types';
import { Component } from 'react';
import ReferenceDisplayValue from 'customer-data-reference-ui-components/ReferenceDisplayValue';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import UITextArea from 'UIComponents/input/UITextArea';
import UITextInput from 'UIComponents/input/UITextInput';
import UIExpandableText from 'UIComponents/text/UIExpandableText';
import UIExpandingTextArea from 'UIComponents/input/UIExpandingTextArea';
import { getDataAttributes } from '../utils/getDataAttributes';

var getTransferableProps = function getTransferableProps(props) {
  return omit(['actions', 'baseUrl', 'caretRenderer', 'isInline', 'InputComponent', 'multiCurrencyCurrencyCode', 'objectType', 'onCancel', 'onInvalidProperty', 'onSecondaryChange', 'options', 'property', 'propertyIndex', 'readOnlySourceData', 'resize', 'resolver', 'secondaryChanges', 'showError', 'showPlaceholder', 'subjectId', 'wrappers', 'onTracking', 'isRequired', 'onPipelineChange'], props);
};

var propTypes = {
  autoFocus: PropTypes.bool,
  displayValue: PropTypes.string,
  objectType: PropTypes.string,
  // TODO COBJECT RECORD: stronger proptype validation
  onChange: PropTypes.func,
  property: PropTypes.instanceOf(PropertyRecord).isRequired,
  readOnlySourceData: PropTypes.shape({
    isKnownGuid: PropTypes.func,
    getGuidLabel: PropTypes.func
  }),
  resolver: ReferenceResolverType,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string
};

var PropertyInputReadOnly = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputReadOnly, _Component);

  function PropertyInputReadOnly() {
    _classCallCheck(this, PropertyInputReadOnly);

    return _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputReadOnly).apply(this, arguments));
  }

  _createClass(PropertyInputReadOnly, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.autoFocus) {
        this.focus();
      }
    }
  }, {
    key: "focus",
    value: function focus() {
      var input = this.refs.input;

      if (input && input.focus) {
        this.refs.input.focus();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          property = _this$props.property,
          objectType = _this$props.objectType,
          onChange = _this$props.onChange,
          value = _this$props.value,
          resolver = _this$props.resolver,
          className = _this$props.className;
      var InputComponent = isTextarea(property) ? UITextArea : UITextInput;

      if (resolver) {
        return /*#__PURE__*/_jsx(ReferenceDisplayValue, Object.assign({}, getDataAttributes(this.props), {
          InputComponent: InputComponent,
          objectType: objectType,
          onChange: onChange,
          property: property,
          readOnly: true,
          readOnlySourceData: this.props.readOnlySourceData,
          ref: "input",
          resolver: resolver,
          value: value,
          className: className,
          multi: isMultienum(property)
        }));
      }

      var displayValue = "" + getDisplayedValue(property, value);
      var inputProps = Object.assign({}, getTransferableProps(this.props), {
        readOnly: true,
        error: !isValidPropertyValue(property, value),
        ref: 'input',
        value: displayValue
      });

      if (isTextarea(property) || isSingleLineText(property) || isEnum(property) && isMultiple(property)) {
        return /*#__PURE__*/_jsx(UIExpandableText, {
          hideButtonCaret: true,
          children: /*#__PURE__*/_jsx(UIExpandingTextArea, Object.assign({
            className: className
          }, inputProps, {
            shrink: true,
            children: displayValue
          }))
        });
      }

      return /*#__PURE__*/_jsx(InputComponent, Object.assign({}, inputProps));
    }
  }]);

  return PropertyInputReadOnly;
}(Component);

export { PropertyInputReadOnly as default };
PropertyInputReadOnly.propTypes = propTypes;