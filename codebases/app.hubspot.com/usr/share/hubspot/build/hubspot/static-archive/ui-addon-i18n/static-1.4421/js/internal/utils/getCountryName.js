'use es6';

import I18n from 'I18n';
import { allCountries } from 'I18n/constants/TelephoneData';
export default (function (code) {
  var countries = allCountries;

  var getCountryName = function getCountryName(countryCode) {
    return I18n.text("SharedI18nStrings.countryCodes." + countryCode.toUpperCase());
  };

  var translatedCountries = I18n.text('SharedI18nStrings.countryCodes');

  if (translatedCountries[code.toUpperCase()]) {
    return getCountryName(code);
  }

  var countryData = countries.find(function (country) {
    return country.iso2 === code.toLowerCase();
  });

  if (countryData) {
    return countryData.name;
  }

  return I18n.text('i18nAddon.countryInfo.invalidCountryOption');
});