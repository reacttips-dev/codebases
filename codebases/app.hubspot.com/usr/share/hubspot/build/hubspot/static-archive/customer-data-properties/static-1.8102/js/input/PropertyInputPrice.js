'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import omit from 'transmute/omit';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import UICurrencyInput from 'UIComponents/input/UICurrencyInput';
import { getCurrencyCodeForPriceProperty } from 'customer-data-objects/lineItem/PropertyNames';
var PropertyInputPrice = /*#__PURE__*/forwardRef(function (props, ref) {
  var property = props.property,
      passedCurrencyCode = props.currencyCode,
      value = props.value,
      _props$min = props.min,
      min = _props$min === void 0 ? 0 : _props$min;
  var transferableProps = omit(['baseUrl', 'caretRenderer', 'isInline', 'objectType', 'onCancel', 'onInvalidProperty', 'property', 'propertyIndex', 'readOnlySourceData', 'resolver', 'resolvers', 'showError', 'showPlaceholder', 'subjectId', 'secondaryChanges', 'onSecondaryChange', 'wrappers', 'onTracking', 'isRequired'], props);
  var currencyCode = passedCurrencyCode || getCurrencyCodeForPriceProperty(property.name);
  return /*#__PURE__*/_jsx(UICurrencyInput, Object.assign({}, transferableProps, {
    min: min,
    currency: currencyCode,
    inputRef: ref,
    value: isNaN(value) ? null : +value
  }));
});
PropertyInputPrice.propTypes = {
  property: PropTypes.instanceOf(PropertyRecord).isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  currencyCode: PropTypes.string,
  min: PropTypes.number,
  onChange: PropTypes.func
};
export default PropertyInputPrice;