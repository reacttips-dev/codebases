'use es6';

import I18n from 'I18n';
export default (function () {
  var lang = I18n.locale.split('-')[0];
  return lang !== 'en' && !I18n.langEnabled && !I18n.publicPage ? 'en' : lang;
});