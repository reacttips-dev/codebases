'use es6';

import I18n from 'I18n';
export default (function (amount, currencyCode) {
  return I18n.text('i18n.numberRepresentation.numberWithCurrencyCode', {
    amountNumberValue: amount,
    currencyCode: currencyCode
  });
});