import getLang from 'I18n/utils/getLang';
import getLangLocale from 'I18n/utils/getLangLocale';
import getCountryCodeFromLocale from 'I18n/utils/getCountryCodeFromLocale';
import salesPhoneNumbers, { DEFAULT_PHONE_NUMBER } from '../constants/salesPhoneNumbers';
export default function () {
  var lang = getLang();
  var locale = getLangLocale();

  if (salesPhoneNumbers[locale]) {
    var countryCode = getCountryCodeFromLocale().toUpperCase();
    return salesPhoneNumbers[locale][lang] ? {
      phoneNumber: salesPhoneNumbers[locale][lang],
      countryCode: countryCode
    } : {
      phoneNumber: salesPhoneNumbers[locale].en,
      countryCode: countryCode
    };
  }

  return {
    phoneNumber: DEFAULT_PHONE_NUMBER,
    countryCode: 'US'
  };
}