'use es6';

import { getCountryOptions } from './getCountryOptions';
var phoneOptions = [];
export default (function (phoneData) {
  if (phoneOptions.length) {
    return phoneOptions;
  }

  var countryOptions = getCountryOptions();
  phoneOptions = countryOptions.filter(function (option) {
    return phoneData.find(function (c) {
      return c.iso2 === option.value;
    });
  }).map(function (option) {
    var dialCode = phoneData.find(function (c) {
      return c.iso2 === option.value;
    }).dialCode;
    return Object.assign({}, option, {
      text: option.text + " +" + dialCode
    });
  });
  return phoneOptions;
});