'use es6';

import getLang from 'I18n/utils/getLang';
var knowledgeBaseDomain = 'knowledge.hubspot.com';
var langRegex = new RegExp(/knowledge.hubspot.com\/\w{2}\//);

var getKnowledgeLang = function getKnowledgeLang(lang) {
  var swapLangs = {
    ja: 'jp'
  };
  return swapLangs[lang] ? swapLangs[lang] : lang;
};

var ignoreLangs = {
  sv: 'sv',
  pl: 'pl',
  fi: 'fi'
};
export default (function (url) {
  var urlBaseMatch = langRegex.test(url);
  var knowledgeLang = getKnowledgeLang(getLang());

  if (ignoreLangs[knowledgeLang] || urlBaseMatch || knowledgeLang === 'en') {
    return url;
  }

  return url.replace(knowledgeBaseDomain, knowledgeBaseDomain + "/" + knowledgeLang);
});