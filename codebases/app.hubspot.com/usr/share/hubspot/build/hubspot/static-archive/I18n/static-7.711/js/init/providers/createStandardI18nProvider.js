'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { setManualOverwrites, getValidLocale, setupTimezone, defaultLanguage, momentMappings, setHtmlLang } from '../internal/legacyI18nInit';
import { create } from '../internal/hs-intl';
import localeMapper from '../internal/localeMapper';
import * as localStorage from '../internal/localStorage';
import { PUBLIC_CACHE, STANDARD_CACHE } from '../internal/localeCacheKeys';
export default (function (options) {
  var intl = create();

  var _setLocale = intl.setLocale,
      _register = intl.register,
      rest = _objectWithoutProperties(intl, ["setLocale", "register"]);

  var localesToLoad = [];
  var I18nProvider = Object.assign({
    register: function register(lang) {
      var registerOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var mapper = registerOptions.localeMapper || localeMapper;

      var p = _register.call(intl, lang, Object.assign({}, registerOptions, {
        localeMapper: function localeMapper() {
          var l = mapper.apply(void 0, arguments);

          if (l && !localesToLoad.includes(l)) {
            localesToLoad.push(l);
          }

          return l;
        }
      }));

      p.then(function () {
        if (!options || options.__localesCacheKey !== PUBLIC_CACHE) {
          localStorage.setItem(options && options.__localesCacheKey || STANDARD_CACHE, JSON.stringify(localesToLoad));
        }
      });
      return p;
    },
    setLocale: function setLocale(_ref) {
      var locale = _ref.locale,
          langEnabled = _ref.langEnabled,
          timezone = _ref.timezone;
      setManualOverwrites();
      setupTimezone(timezone);
      I18n.locale = I18n.manualLocale || getValidLocale(locale);
      I18n.lang = I18n.locale.split('-')[0]; // deprecated, use getLang() instead

      I18n.langEnabled = !!I18n.manualLocale || langEnabled;
      var loaderLocales = I18n.langEnabled ? [I18n.locale] : [];

      if (!I18n.langEnabled && I18n.locale === defaultLanguage) {
        // We still set new users to en instead of en-us if they have never changed their settings
        // We need to load en-us number formats
        loaderLocales.push('en-us');
      }

      var shouldLoadFallback = !(options && options.excludeFallback);

      if (shouldLoadFallback) {
        loaderLocales.push(defaultLanguage);
      }

      I18n.fired.ready = true;
      I18n.Info.resolve({
        locale: I18n.locale,
        langEnabled: I18n.langEnabled,
        timezone: I18n.timezone
      });

      if (I18n.moment) {
        var validMomentLocale = momentMappings[I18n.locale] || momentMappings[I18n.locale.split('-')[0]];

        if (I18n.moment.locales().indexOf(validMomentLocale) < 0) {
          validMomentLocale = defaultLanguage;
        }

        if (validMomentLocale !== I18n.moment.locale()) {
          I18n.moment.locale(validMomentLocale);
        }
      }

      setHtmlLang();
      return _setLocale(loaderLocales);
    }
  }, rest);
  return I18nProvider;
});