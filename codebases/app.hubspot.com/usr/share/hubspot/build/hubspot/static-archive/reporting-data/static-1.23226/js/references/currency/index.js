'use es6';

import I18n from 'I18n';
import { Promise } from '../../lib/promise';
import { toUpperCase } from '../../lib/string';
import { makeOption } from '../Option';
export var generateCurrencyLabel = function generateCurrencyLabel(_, code) {
  var sanitized = toUpperCase(code);

  var _ref = I18n.currencySymbols[sanitized] || {},
      name_plural = _ref.name_plural;

  return name_plural ? name_plural + " (" + sanitized + ")" : sanitized;
};
export default (function (currencyCodes) {
  return Promise.resolve(currencyCodes.map(function () {
    var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return makeOption(code, generateCurrencyLabel(undefined, code));
  }));
});