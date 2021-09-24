'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UISelect from 'UIComponents/input/UISelect';
import { getCurrencyOptions } from '../internal/utils/CurrencyFormatting';
import { currencyStyles } from 'I18n/internal/utils/CurrencyLabelFormatters';

var CurrencySelect = function CurrencySelect(props) {
  var currencyStyle = props.currencyStyle,
      validCurrencies = props.validCurrencies,
      currenciesFilter = props.currenciesFilter,
      passThroughProps = _objectWithoutProperties(props, ["currencyStyle", "validCurrencies", "currenciesFilter"]);

  return /*#__PURE__*/_jsx(UISelect, Object.assign({}, passThroughProps, {
    className: props.className,
    options: getCurrencyOptions({
      currencyStyle: currencyStyle,
      currenciesFilter: currenciesFilter,
      validCurrencies: validCurrencies
    })
  }));
};

CurrencySelect.propTypes = {
  className: PropTypes.string,
  currencyStyle: PropTypes.oneOf(Object.keys(currencyStyles)).isRequired,
  validCurrencies: PropTypes.array,
  currenciesFilter: PropTypes.func
};
CurrencySelect.defaultProps = {
  currencyStyle: currencyStyles.short
};
export default CurrencySelect;