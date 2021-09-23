'use es6';

import I18n from 'I18n';
import localeMapper from './localeMapper';
import { initializeI18nMethods } from './initializeI18nMethods';
initializeI18nMethods(I18n);

if (I18n.isLegacyLoader) {
  console.error('Modules in I18n/init must be used with the new loader. See go/new-i18n');
}

export function createLoader(_ref) {
  var context = _ref.context,
      source = _ref.source,
      mode = _ref.mode;

  if (!context) {
    throw new Error('invalid provider source');
  }

  var locales = Object.keys(context);

  function transformModule(mod) {
    return mod;
  }

  function loadContext(locale) {
    if (locales.indexOf(locale) < 0) {
      throw new Error("locale " + locale + " does not exist for " + source);
    }

    return context[locale]();
  }

  function loadSync(locale) {
    if (mode !== 'sync') {
      throw new Error(source + " is not sync");
    }

    return transformModule(loadContext(locale));
  }

  function loadLazy(locale) {
    if (mode !== 'lazy') {
      throw new Error(source + " is not lazy");
    }

    return loadContext(locale).then(transformModule).catch(function (error) {
      return setTimeout(function () {
        throw error;
      }, 0);
    });
  }

  function load(allLocales) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var loadLocalePromises = [];
    var map = options.localeMapper || localeMapper;
    var alreadyLoadedLocales = {};
    allLocales.forEach(function (locale) {
      var localeToLoad = map(locale, locales);
      var hasLoadedLocale = alreadyLoadedLocales[localeToLoad];

      if (!hasLoadedLocale && localeToLoad && mode === 'lazy') {
        loadLocalePromises.push(loadLazy(localeToLoad));
        alreadyLoadedLocales[localeToLoad] = true;
      } else if (!hasLoadedLocale && localeToLoad) {
        loadLocalePromises.push(Promise.resolve(loadSync(localeToLoad)));
        alreadyLoadedLocales[localeToLoad] = true;
      }
    });
    return Promise.all(loadLocalePromises).catch(function (error) {
      return setTimeout(function () {
        throw error;
      }, 0);
    });
  }

  return {
    mode: mode,
    load: load,
    locales: locales,
    loadSync: loadSync,
    loadLazy: loadLazy
  };
}
export function create() {
  var setLocale;
  var intl = {
    langRegistry: {},
    localePromise: new Promise(function (resolve) {
      return setLocale = resolve;
    }),
    register: function register(lang) {
      var loadOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (this.langRegistry[lang.source]) {
        return Promise.resolve();
      }

      this.langRegistry[lang.source] = lang;
      var provider = createLoader(lang);
      return this.localePromise.then(function (allLocales) {
        return provider.load(loadOptions.getLocales ? loadOptions.getLocales(allLocales) : allLocales, loadOptions);
      }).catch(function (error) {
        return setTimeout(function () {
          throw error;
        }, 0);
      });
    }
  };
  intl.setLocale = setLocale;
  return intl;
}