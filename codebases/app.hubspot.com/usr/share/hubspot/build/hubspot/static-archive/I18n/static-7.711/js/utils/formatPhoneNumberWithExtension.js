'use es6';

import I18n from 'I18n';
import formatPhoneNumber from './formatPhoneNumber';
export default (function (value, extension) {
  var phoneNumber = formatPhoneNumber(value);
  return I18n.text('i18n.numberRepresentation.phoneNumberWithExtension', {
    phoneNumber: phoneNumber,
    extension: extension
  });
});