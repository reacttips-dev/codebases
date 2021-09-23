'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import Currency from 'customer-data-objects-ui-components/formatting/Currency';
import EmptyState from '../Components/EmptyState';
import FormattedNumber from 'I18n/components/FormattedNumber';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { memo } from 'react';
import get from 'transmute/get';
import isUndefined from 'transmute/isUndefined';

var CurrencyCell = function CurrencyCell(props) {
  var defaultCurrency = props.defaultCurrency,
      value = props.value,
      simplifyCurrency = props.simplifyCurrency;

  if (!value) {
    return /*#__PURE__*/_jsx(EmptyState, {});
  }

  var amount = get('amount', value);

  if (isUndefined(amount)) {
    return /*#__PURE__*/_jsx(EmptyState, {});
  }

  var recordCurrency = get('recordCurrency', value);
  var currencyCode = recordCurrency || defaultCurrency;

  if (!isUndefined(currencyCode)) {
    return /*#__PURE__*/_jsx(Currency, {
      currencyCode: currencyCode,
      simplifyCurrency: simplifyCurrency,
      value: amount
    });
  }

  return /*#__PURE__*/_jsx(FormattedNumber, {
    value: Number(amount)
  });
};

CurrencyCell.defaultProps = {
  simplifyCurrency: true
};
CurrencyCell.propTypes = {
  defaultCurrency: PropTypes.string,
  simplifyCurrency: PropTypes.bool,
  value: ImmutablePropTypes.map
};
export default /*#__PURE__*/memo(CurrencyCell);