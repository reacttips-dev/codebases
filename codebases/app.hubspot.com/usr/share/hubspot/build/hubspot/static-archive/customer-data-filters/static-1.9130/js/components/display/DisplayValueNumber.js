'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { UNFORMATTED } from 'customer-data-objects/property/NumberDisplayHint';
import DisplayValueCurrency from './DisplayValueCurrency';
import FilterOperatorType from 'customer-data-filters/components/propTypes/FilterOperatorType';
import FormattedNumber from 'I18n/components/FormattedNumber';
import PropTypes from 'prop-types';
import { memo } from 'react';

var DisplayValueNumber = function DisplayValueNumber(props) {
  var operator = props.operator,
      value = props.value;
  var _operator$field = operator.field,
      numberDisplayHint = _operator$field.numberDisplayHint,
      showCurrencySymbol = _operator$field.showCurrencySymbol;
  var currencyCode = showCurrencySymbol ? props.currencyCode : undefined;

  if (showCurrencySymbol) {
    return /*#__PURE__*/_jsx(DisplayValueCurrency, {
      currencyCode: currencyCode,
      simplifyCurrency: true,
      value: value
    });
  }

  if (numberDisplayHint !== UNFORMATTED) {
    return /*#__PURE__*/_jsx(FormattedNumber, {
      value: value
    });
  }

  return /*#__PURE__*/_jsx("span", {
    children: value
  });
};

DisplayValueNumber.propTypes = {
  currencyCode: PropTypes.string.isRequired,
  operator: FilterOperatorType.isRequired,
  value: PropTypes.number.isRequired
};
export default /*#__PURE__*/memo(DisplayValueNumber);