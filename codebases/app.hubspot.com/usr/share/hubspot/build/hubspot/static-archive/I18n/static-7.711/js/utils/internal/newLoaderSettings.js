'use es6'; // set flags on I18n object for Baldric and I18n.Info

export function initializeNewLoaderSettings(I18n) {
  I18n.fallbacks = true;
  I18n.fired = {};

  if (!I18n.currencySymbols) {
    I18n.currencySymbols = {};
  }

  if (!I18n.baseLocales) {
    I18n.baseLocales = {};
  }

  if (!I18n.publicLocales) {
    I18n.publicLocales = {};
  } // if (window && window.I18n && window.I18n.loaded) {
  //   console.error('I18n/init.js brought in more than once');
  // }


  I18n.loaded = true; // I18n.Info promise used to figure out if we've determined the user's language already

  var infoPromise = {};
  I18n.Info = new Promise(function (resolve, reject) {
    infoPromise.resolve = resolve;
    infoPromise.reject = reject;
  });
  I18n.Info.resolve = infoPromise.resolve;
  I18n.Info.reject = infoPromise.reject;
}