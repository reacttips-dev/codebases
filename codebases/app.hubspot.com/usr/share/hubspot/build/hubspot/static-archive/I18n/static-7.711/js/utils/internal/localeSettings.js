'use es6';

import { DEFAULT_OPTIONS } from './DefaultOptions';
export function initializeLocaleSettings(I18n) {
  // Much like `reset`, but only assign options if not already assigned
  var initializeOptions = function initializeOptions() {
    // if (typeof I18n.locale === 'undefined' && I18n.locale !== null) {
    //   I18n.locale = DEFAULT_OPTIONS.locale;
    // }
    if (typeof I18n.placeholder === 'undefined' && I18n.placeholder !== null) {
      I18n.placeholder = DEFAULT_OPTIONS.placeholder;
    }

    if (typeof I18n.fallbacks === 'undefined' && I18n.fallbacks !== null) {
      I18n.fallbacks = DEFAULT_OPTIONS.fallbacks;
    }

    if (typeof I18n.translations === 'undefined' && I18n.translations !== null) {
      I18n.translations = DEFAULT_OPTIONS.translations;
    }
  };

  initializeOptions();
  I18n.locales = {}; // The default locale list.

  I18n.locales['default'] = function (locale) {
    var locales = [];
    var list = [];
    var countryCode; // Handle the inline locale option that can be provided to
    // the `I18n.t` options.

    if (locale) {
      locales.push(locale);
    } // Add the current locale to the list.


    if (!locale && I18n.locale) {
      locales.push(I18n.locale);
    } // HACK, Handle invalid Norwegian keys


    if (locale === 'noNO' || !locale && I18n.locale === 'noNO') {
      locales.push('no-no');
    } else if (locale === 'no-no' || !locale && I18n.locale === 'no-no') {
      locales.push('noNO');
    } // END HACK
    // Add the default locale if fallback strategy is enabled.


    if (I18n.fallbacks && DEFAULT_OPTIONS.defaultLocale) {
      locales.push(DEFAULT_OPTIONS.defaultLocale);
    } // Compute each locale with its country code.
    // So this will return an array containing both
    // `de-DE` and `de` locales.


    locales.forEach(function (loc) {
      countryCode = loc.split('-')[0];

      if (!~list.indexOf(loc)) {
        list.push(loc);
      } // HubSpot Hack: Fall back lowercase locales (pt-BR to pt-br) I18n/473


      if (!~list.indexOf(loc.toLowerCase())) {
        list.push(loc.toLowerCase());
      } // End Hack


      if (I18n.fallbacks && countryCode && countryCode !== loc && !~list.indexOf(countryCode)) {
        list.push(countryCode);
      }
    }); // No locales set? English it is.

    if (!locales.length) {
      locales.push('en');
    }

    return list;
  }; // Retrieve locales based on inline locale, current locale or default to
  // I18n's detection.


  I18n.locales.get = function (locale) {
    var result = this[locale] || this[I18n.locale] || this['default'];

    if (typeof result === 'function') {
      result = result(locale);
    }

    if (result instanceof Array === false) {
      result = [result];
    }

    return result;
  }; // Hold pluralization rules.


  I18n.pluralization = {}; // Return the pluralizer for a specific locale.
  // If no specify locale is found, then I18n's default will be used.

  I18n.pluralization.get = function (locale) {
    return this[locale] || this[I18n.locale] || this['default'];
  }; // The default pluralizer rule.
  // It detects the `zero`, `one`, and `other` scopes.


  I18n.pluralization['default'] = function (count) {
    switch (count) {
      case 0:
        return ['zero', 'other'];
      // HACK, HubSpot customization, more info at https://git.hubteam.com/HubSpot/I18n/commit/c1debccf2409a358b5456830c472ae78ece5e634#commitcomment-8149
      // case 1: return ["one"];

      case 1:
        return ['one', 'other'];
      // END HACK

      default:
        return ['other'];
    }
  }; // Return current locale. If no locale has been set, then
  // the current locale will be the default locale.


  I18n.currentLocale = function () {
    return I18n.locale || DEFAULT_OPTIONS.defaultLocale;
  };

  var zeroAsOnePluralFr = function zeroAsOnePluralFr(count) {
    var validCount = count === 0 ? 1 : count;
    return I18n.pluralization.default(validCount);
  };

  I18n.pluralization.fr = zeroAsOnePluralFr;
}