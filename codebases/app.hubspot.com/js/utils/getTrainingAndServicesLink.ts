var getLangKey = function getLangKey() {
  if (window.I18n) {
    return window.I18n.lang;
  }

  return null;
};

var LINKS = {
  en: 'https://www.hubspot.com/services',
  ja: 'https://www.hubspot.jp/services',
  de: 'https://www.hubspot.de/services',
  es: 'https://www.hubspot.es/services',
  pt: 'https://br.hubspot.com/services',
  fr: 'https://www.hubspot.fr/services'
};
export var getTrainingAndServicesLink = function getTrainingAndServicesLink() {
  return LINKS[getLangKey() || ''] || LINKS.en;
};