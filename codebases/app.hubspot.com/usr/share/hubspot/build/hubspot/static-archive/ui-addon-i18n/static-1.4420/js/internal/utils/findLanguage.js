'use es6'; // A language's key in I18n and its official language value can be different, so we have to
// do a lookup for an object with the correct language value

export default (function (options, language, multi) {
  if (!multi) {
    var langKey = Object.keys(options).find(function (lang) {
      return options[lang].language === language;
    });
    return options[langKey];
  }

  var langKeyObject = {};
  Object.keys(options).forEach(function (key) {
    langKeyObject[options[key].language] = options[key];
  });
  return language.map(function (lang) {
    return langKeyObject[lang];
  });
});