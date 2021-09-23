'use es6';

import registerI18nTranslations from './registerI18nTranslations';
import registerNumberFormatting from './registerNumberFormatting';
export default (function (Provider) {
  return Promise.all([registerI18nTranslations(Provider), registerNumberFormatting(Provider)]);
});