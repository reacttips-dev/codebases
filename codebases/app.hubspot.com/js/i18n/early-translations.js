'use es6';

import langs from 'i2l?mode=very-lazy&query=sporks!../../lang/en.lyaml'; // this is hardcoded in i18n

var CACHE_KEY = 'i18n-cached-standard-locales';
var loaded = false;

try {
  if (localStorage) {
    var locales = JSON.parse(localStorage.getItem(CACHE_KEY));
    locales.forEach(function (locale) {
      if (Object.prototype.hasOwnProperty.call(langs.context, locale)) {
        loaded = true;
        langs.context[locale]();
      }
    });
  }
} catch (err) {// ignore
}

if (!loaded) {
  langs.context.en();
}