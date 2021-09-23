'use es6';

import getLangLocale from './getLangLocale';
import formatName from './formatName';
var formalNameLanguages = ['de', 'ja'];
export default (function (_ref, options) {
  var givenName = _ref.givenName,
      familyName = _ref.familyName,
      email = _ref.email;
  var locale = options && options.locale || getLangLocale();
  return formalNameLanguages.indexOf(locale) >= 0 || !givenName ? formatName({
    firstName: givenName,
    lastName: familyName,
    email: email
  }, options) : givenName;
});