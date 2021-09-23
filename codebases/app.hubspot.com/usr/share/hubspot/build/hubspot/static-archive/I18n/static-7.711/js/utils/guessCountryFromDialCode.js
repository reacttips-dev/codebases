'use es6';

import getCountryCodeFromLocale from './getCountryCodeFromLocale';
import * as TelephoneData from 'I18n/constants/TelephoneData';
var INVALID_OPTION = {
  dialCode: '',
  priority: 10001,
  iso2: null
};
export default (function (inputNumber) {
  var allCountries = TelephoneData.allCountries;
  var allCountryCodes = TelephoneData.allCountryCodes;
  var iso2Lookup = TelephoneData.iso2Lookup;
  var bestGuess;
  var secondBestGuess = allCountries[iso2Lookup[getCountryCodeFromLocale()]] || allCountries[iso2Lookup.us];
  var inputNumberForCountries = inputNumber.substr(0, 4);

  if (inputNumber.trim() !== '') {
    var selectedCountry = INVALID_OPTION;
    allCountries.every(function (country) {
      // no country should have a dial code of more than 4 digits
      if (selectedCountry.dialCode.length === 4) {
        return false;
      } // if the country dialCode exists with area code (4 digits)


      if (allCountryCodes[inputNumberForCountries] && allCountryCodes[inputNumberForCountries][0] === country.iso2) {
        selectedCountry = country;
        return true; // if the selected country dialCode is there with the area code
      } else if (allCountryCodes[inputNumberForCountries] && allCountryCodes[inputNumberForCountries][0] === selectedCountry.iso2) {
        return true;
      } // else check if the input number closely matches this country


      if (inputNumber.indexOf(country.dialCode) === 0) {
        if (country.dialCode.length > selectedCountry.dialCode.length || country.dialCode.length === selectedCountry.dialCode.length && country.priority < selectedCountry.priority) {
          selectedCountry = country;
          return true;
        }
      }

      return true;
    });
    bestGuess = selectedCountry;
  }

  if (!bestGuess || !bestGuess.iso2) {
    return secondBestGuess;
  }

  return bestGuess;
});