const Language = require('@trello/locale');

const getLocale = function () {
  const lowerCaseLocale = Language.currentLocale.toLowerCase();
  const localeCode = (() => {
    switch (false) {
      case lowerCaseLocale !== 'zh-tw':
        return 'zh-hant';
      case lowerCaseLocale !== 'zh-cn':
        return 'zh-hans';
      case lowerCaseLocale !== 'zh-hant':
        return 'zh-hant';
      case lowerCaseLocale !== 'zh-hans':
        return 'zh-hans';
      case lowerCaseLocale !== 'pt-br':
        return 'pt-br';
      default:
        return lowerCaseLocale.split('-')[0];
    }
  })();

  return localeCode;
};

const getTranslatedFile = function (fileMap, locale) {
  const localeCode = getLocale();
  const fileKeys = Object.keys(fileMap);
  if (fileKeys.includes(localeCode)) {
    return fileMap[localeCode];
  }
  return fileMap['en'];
};

module.exports = {
  getLocale,
  getTranslatedFile,
};
