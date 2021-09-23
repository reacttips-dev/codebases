'use es6';

import I18n from 'I18n';
export default (function () {
  return I18n.locale !== 'en-us' && !I18n.langEnabled && !I18n.publicPage ? 'en-us' : I18n.locale;
});