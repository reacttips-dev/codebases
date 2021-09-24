'use es6';

import { FALLBACK_FONT_STACK as SYS_FONT_STACK, WEB_FONT_REGULAR as WEB_FONT_FAMILY, WEB_FONT_REGULAR_WEIGHT, WEB_FONT_MEDIUM_WEIGHT, WEB_FONT_DEMI_BOLD_WEIGHT, WEB_FONT_BOLD_WEIGHT, ICON_FONT_FAMILY } from 'HubStyleTokens/misc';
import { domReady } from '../listeners/domReady';
var forceSkip = false;
var fontsHaveLoaded = false;
var iconFontsHaveLoaded = false;
/**
 * Hook for tests to skip font measurement. Must be called before `DOMContentLoaded` fires.
 */

export var forceSkipFontMeasurement = function forceSkipFontMeasurement() {
  forceSkip = true;
};
/**
 * Creates a measure element with the specified content, `font-family`, and `font-weight`, and
 * appends it to `document.body`.
 *
 * @param {string} content
 * @param {string} fontFamily
 * @param {string} fontWeight
 */

export var createMeasureEl = function createMeasureEl(content, fontFamily, fontWeight) {
  var measureEl = document.createElement('div');
  measureEl.setAttribute('aria-hidden', 'true'); // http://go/jira/CG-13204

  measureEl.textContent = content;
  measureEl.style.position = 'absolute';
  measureEl.style.top = '-999px';
  measureEl.style.fontFamily = fontFamily;
  measureEl.style.fontWeight = fontWeight;
  document.body.appendChild(measureEl);
  return measureEl;
};
/**
 * Compares the size of a set of elements that use web fonts and a corresponding set of elements
 * that use system fonts. If the elements have different sizes (indicating that the web font has
 * loaded), the mismatched elements are removed from both sets.
 *
 * @param {Array} webFontMeasureEls
 * @param {Array} sysFontMeasureEls
 */

var compareMeasureEls = function compareMeasureEls(webFontMeasureEls, sysFontMeasureEls) {
  for (var i = 0; i < webFontMeasureEls.length; i++) {
    var webFontTextWidth = webFontMeasureEls[i].offsetWidth;
    var sysFontTextWidth = sysFontMeasureEls[i].offsetWidth;

    if (webFontTextWidth !== sysFontTextWidth) {
      document.body.removeChild(webFontMeasureEls[i]);
      document.body.removeChild(sysFontMeasureEls[i]);
      webFontMeasureEls.splice(i, 1);
      sysFontMeasureEls.splice(i, 1);
    }
  }
};
/**
 * A promise that resolves when all variants of our base font (Avenir) have been loaded.
 */


export var fontsLoadedPromise = new Promise(function (resolve) {
  domReady(function () {
    if (forceSkip) {
      resolve();
      return;
    } // For each font weight, create a test element with our webfont and another with the fallback.


    var testText = 'BESbswy';
    var WEB_FONT_STACK = "\"" + WEB_FONT_FAMILY + "\", " + SYS_FONT_STACK;
    var webFontMeasureEls = [];
    var sysFontMeasureEls = [];
    [WEB_FONT_REGULAR_WEIGHT, WEB_FONT_MEDIUM_WEIGHT, WEB_FONT_DEMI_BOLD_WEIGHT, WEB_FONT_BOLD_WEIGHT].forEach(function (weight) {
      webFontMeasureEls.push(createMeasureEl(testText, WEB_FONT_STACK, weight));
      sysFontMeasureEls.push(createMeasureEl(testText, SYS_FONT_STACK, weight));
    });

    var poll = function poll() {
      compareMeasureEls(webFontMeasureEls, sysFontMeasureEls);

      if (webFontMeasureEls.length === 0) {
        fontsHaveLoaded = true;
        resolve();
      } else {
        setTimeout(poll, 50);
      }
    };

    poll();
  });
});
/**
 * A function that corresponds to whether `fontsLoadedPromise` has resolved.
 * @returns {boolean}
 */

export var fontsLoaded = function fontsLoaded() {
  return fontsHaveLoaded;
};
/**
 * A promise that resolves when all variants of our icon font have been loaded.
 */

export var iconFontsLoadedPromise = new Promise(function (resolve) {
  domReady(function () {
    if (forceSkip) {
      resolve();
      return;
    } // For each font weight, create a test element with our webfont and another with the fallback.


    var testText = 'add';
    var WEB_FONT_STACK = "\"" + ICON_FONT_FAMILY + "\", " + SYS_FONT_STACK;
    var webFontMeasureEls = [];
    var sysFontMeasureEls = [];
    ['normal', // spacesword-low
    'bold' // spacesword-high
    ].forEach(function (weight) {
      webFontMeasureEls.push(createMeasureEl(testText, WEB_FONT_STACK, weight));
      sysFontMeasureEls.push(createMeasureEl(testText, SYS_FONT_STACK, weight));
    });

    var poll = function poll() {
      compareMeasureEls(webFontMeasureEls, sysFontMeasureEls);

      if (webFontMeasureEls.length === 0) {
        iconFontsHaveLoaded = true;
        resolve();
      } else {
        setTimeout(poll, 50);
      }
    };

    poll();
  });
});
/**
 * A function that corresponds to whether `iconFontsLoadedPromise` has resolved.
 * @returns {boolean}
 */

export var iconFontsLoaded = function iconFontsLoaded() {
  return iconFontsHaveLoaded;
};