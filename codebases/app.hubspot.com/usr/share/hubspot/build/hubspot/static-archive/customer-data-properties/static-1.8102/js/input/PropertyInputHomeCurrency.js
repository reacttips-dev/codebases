'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { createRef } from 'react';
import { deref, watch, unwatch } from 'atom';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import getIn from 'transmute/getIn';
import ConnectReferenceResolvers from 'reference-resolvers/ConnectReferenceResolvers';
import { MULTI_CURRENCY_INFORMATION } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { isResolved } from 'reference-resolvers/utils';
import ProvideReferenceResolvers from 'reference-resolvers/ProvideReferenceResolvers';
import MultiCurrencyInformationResolver from 'reference-resolvers/resolvers/MultiCurrencyInformationResolver';
import WithClassWrapper from 'customer-data-objects-ui-components/hoc/WithClassWrapper';
import UICurrencyInput from 'UIComponents/input/UICurrencyInput';
import UINumberInput from 'UIComponents/input/UINumberInput';
import refObject from 'UIComponents/utils/propTypes/refObject';
var propTypes = {
  inputRef: refObject,
  multiCurrencyCurrencyCode: PropTypes.string,
  subjectCurrencyCode: PropTypes.string,
  nextPipeline: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  property: PropTypes.instanceOf(PropertyRecord).isRequired,
  resolvers: PropTypes.object,
  value: PropTypes.node
};

var PropertyInputHomeCurrency = /*#__PURE__*/function (_PureComponent) {
  _inherits(PropertyInputHomeCurrency, _PureComponent);

  function PropertyInputHomeCurrency(props) {
    var _this;

    _classCallCheck(this, PropertyInputHomeCurrency);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputHomeCurrency).call(this, props));

    _this.handleMultiCurrencyInfoChange = function (reference) {
      if (isResolved(reference)) {
        _this.setState({
          currencyCode: getIn(['referencedObject', 'currencyCode'], reference)
        });
      }
    };

    _this.state = {
      currencyCode: null
    };
    _this.inputRef = /*#__PURE__*/createRef();
    return _this;
  }

  _createClass(PropertyInputHomeCurrency, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var resolver = this.props.resolvers[MULTI_CURRENCY_INFORMATION];

      if (resolver) {
        this.referenceAtom = resolver.byId('default');
        watch(this.referenceAtom, this.handleMultiCurrencyInfoChange);
        this.handleMultiCurrencyInfoChange(deref(this.referenceAtom));
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.referenceAtom) {
        unwatch(this.referenceAtom, this.handleMultiCurrencyInfoChange);
      }
    }
  }, {
    key: "focus",
    value: function focus() {
      (this.props.inputRef || this.inputRef).current.focus();
      (this.props.inputRef || this.inputRef).current.select();
    }
  }, {
    key: "getCurrencyCode",
    value: function getCurrencyCode() {
      var _this$props = this.props,
          multiCurrencyCurrencyCode = _this$props.multiCurrencyCurrencyCode,
          subjectCurrencyCode = _this$props.subjectCurrencyCode;
      var currencyCode = this.state.currencyCode; // Use the currency code from props if provided

      return multiCurrencyCurrencyCode || subjectCurrencyCode || currencyCode;
    }
  }, {
    key: "getTransferrableProps",
    value: function getTransferrableProps() {
      var _this$props2 = this.props,
          __baseUrl = _this$props2.baseUrl,
          __caretRenderer = _this$props2.caretRenderer,
          __isInline = _this$props2.isInline,
          __isRequired = _this$props2.isRequired,
          __multiCurrencyCurrencyCode = _this$props2.multiCurrencyCurrencyCode,
          __objectType = _this$props2.objectType,
          __onCancel = _this$props2.onCancel,
          __onInvalidProperty = _this$props2.onInvalidProperty,
          __onPipelineChange = _this$props2.onPipelineChange,
          __onTracking = _this$props2.onTracking,
          __property = _this$props2.property,
          __propertyIndex = _this$props2.propertyIndex,
          __readOnlySourceData = _this$props2.readOnlySourceData,
          __resolver = _this$props2.resolver,
          __resolvers = _this$props2.resolvers,
          __showError = _this$props2.showError,
          __showPlaceholder = _this$props2.showPlaceholder,
          __subject = _this$props2.subject,
          __subjectCurrencyCode = _this$props2.subjectCurrencyCode,
          __subjectId = _this$props2.subjectId,
          __secondaryChanges = _this$props2.secondaryChanges,
          __onSecondaryChange = _this$props2.onSecondaryChange,
          __wrappers = _this$props2.wrappers,
          transferrableProps = _objectWithoutProperties(_this$props2, ["baseUrl", "caretRenderer", "isInline", "isRequired", "multiCurrencyCurrencyCode", "objectType", "onCancel", "onInvalidProperty", "onPipelineChange", "onTracking", "property", "propertyIndex", "readOnlySourceData", "resolver", "resolvers", "showError", "showPlaceholder", "subject", "subjectCurrencyCode", "subjectId", "secondaryChanges", "onSecondaryChange", "wrappers"]);

      return transferrableProps;
    }
  }, {
    key: "render",
    value: function render() {
      var value = this.props.value;
      var currency = this.getCurrencyCode();
      var transferrableProps = this.getTransferrableProps(); // weed out values that would coerce to NaN or falsey values like "" or null

      var parsedValue = isNaN(value) || !value && value !== 0 ? null : +value;

      if (!currency) {
        return /*#__PURE__*/_jsx(UINumberInput, Object.assign({}, transferrableProps, {
          onChange: this.props.onChange,
          inputRef: this.props.inputRef || this.inputRef,
          value: parsedValue
        }));
      }

      return /*#__PURE__*/_jsx(UICurrencyInput, Object.assign({}, transferrableProps, {
        isNativeCurrency: false,
        currency: currency,
        onChange: this.props.onChange,
        inputRef: this.props.inputRef || this.inputRef,
        value: parsedValue
      }));
    }
  }]);

  return PropertyInputHomeCurrency;
}(PureComponent);

PropertyInputHomeCurrency.propTypes = propTypes;
var getResolvers = ConnectReferenceResolvers(function (resolvers) {
  return {
    resolvers: resolvers
  };
});
export default ProvideReferenceResolvers(_defineProperty({}, MULTI_CURRENCY_INFORMATION, MultiCurrencyInformationResolver), getResolvers(WithClassWrapper(PropertyInputHomeCurrency), {
  forwardRef: true
}), {
  forwardRef: true,
  mergeResolvers: true
});
export { PropertyInputHomeCurrency as BasePropertyInputHomeCurrency };