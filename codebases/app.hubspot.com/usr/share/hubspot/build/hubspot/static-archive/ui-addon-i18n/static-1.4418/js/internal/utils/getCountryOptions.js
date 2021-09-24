'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import getCountryName from './getCountryName';
import sortOptions from './sortOptions';
import CountryFlag from '../components/CountryFlag';
var allCountryOptions = [];

var getCountriesByCode = function getCountriesByCode() {
  // Should return uppercase language codes and their translations
  return I18n.text('SharedI18nStrings.countryCodes');
};

var buildCountryOption = function buildCountryOption(countryCode) {
  var iso2 = countryCode.toLowerCase();
  return {
    text: getCountryName(iso2),
    value: iso2,
    avatar: /*#__PURE__*/_jsx(CountryFlag, {
      countryCode: iso2
    })
  };
};

export var getCountryOptions = function getCountryOptions() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      optionsFilter = _ref.optionsFilter;

  if (!optionsFilter && allCountryOptions.length) {
    return allCountryOptions;
  } else if (optionsFilter && allCountryOptions.length) {
    return allCountryOptions.filter(optionsFilter);
  }

  allCountryOptions = Object.keys(getCountriesByCode()).map(function (code) {
    return buildCountryOption(code);
  }).sort(sortOptions);

  if (optionsFilter) {
    return allCountryOptions.filter(optionsFilter);
  }

  return allCountryOptions;
};
export var getOptionsForValidCountries = function getOptionsForValidCountries(_ref2) {
  var validCountries = _ref2.validCountries,
      optionsFilter = _ref2.optionsFilter;
  var options = [];
  var countriesByCode = getCountriesByCode();
  validCountries.forEach(function (countryCode) {
    if (countriesByCode[countryCode.toUpperCase()]) {
      options.push(buildCountryOption(countryCode));
    }
  });

  if (optionsFilter) {
    options = options.filter(optionsFilter);
  }

  return options.sort(sortOptions);
};