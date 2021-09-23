'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedCurrency from 'I18n/components/FormattedCurrency';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import { PriceRateNames } from 'products-ui-components/constants/PriceRates';

var FormattedPrice = function FormattedPrice(_ref) {
  var currencyCode = _ref.currencyCode,
      price = _ref.price,
      frequency = _ref.frequency,
      simplifyCurrency = _ref.simplifyCurrency;

  var currencyAndAmount = /*#__PURE__*/_jsx(FormattedCurrency, {
    value: price,
    currencyCode: currencyCode,
    simplifyCurrency: simplifyCurrency
  });

  if (!frequency || !PriceRateNames.includes(frequency)) {
    return currencyAndAmount;
  }

  var messageKey = "products.price.recurring." + frequency;
  return /*#__PURE__*/_jsx(FormattedReactMessage, {
    message: messageKey,
    options: {
      price: currencyAndAmount
    }
  });
};

FormattedPrice.defaultProps = {
  simplifyCurrency: true
};
FormattedPrice.propTypes = {
  currencyCode: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  frequency: PropTypes.string,
  simplifyCurrency: PropTypes.bool
};
export default FormattedPrice;