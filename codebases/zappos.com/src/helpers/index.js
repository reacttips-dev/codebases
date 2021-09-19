import sanitizeHtml from 'sanitize-html';
import cookie from 'cookie';

import { LAZY_TIMEOUT } from 'constants/appConstants';
import { EXPIRE_IMMEDIATE_COOKIE_TIME } from 'constants/cookies';
import memoize from 'helpers/memoize';
import { POPUP_CLASS_RE, RELATIVE_URL_RE } from 'common/regex';
import marketplace from 'cfg/marketplace.json';
const { msaImagesUrl } = marketplace;

const INVALID_ATTRIBUTE_CHARS = /[%\\]/;
// Check for `%` encoding in places outside of the querystring
const isAttributeInvalid = attr => !attr || INVALID_ATTRIBUTE_CHARS.test(attr.split('?')[0]);

/*
  CONVERT ASCII TO HEX VALUE FOR DISPLAYING FROM API
*/
export function makeAscii(str) {
  return str.replace(/&#(\d+);+/gi, (m, a) => String.fromCharCode(a));
}

/*
  Massage the given search term to be appropriate to put in a query string.
*/
export function makeQueryStringSearchTerm(term) {
  return term.trim().replace(/\s+|\+{1,}/g, '+').toLowerCase();
}

/*
  Sanitizes an html string and helps filter out xss vulnerabilities
  Note: this function by default strips out certain tags (eg. img), the default list of allowed tags
    and instructions to modify can be found here: https://www.npmjs.com/package/sanitize-html

  allowedTags is a combination of sanitize-html's defaults, as well as ours. We have commented out a few defaults to prevent our SEO from being dynamically changed
  https://github.com/apostrophecms/sanitize-html/blob/f6c26208e1b5fc79757bfaae4dbfba0c1f9b6a11/index.js#L713
*/

const allowedTags = [
  'address',
  'article',
  'aside',
  'footer',
  'header',
  // 'h1', commented out to prevent our SEO /Accessibility from being manipulated by dynamic content
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hgroup',
  'main',
  'nav',
  'section',
  'blockquote',
  'dd',
  'div',
  'dl',
  'dt',
  'figcaption',
  'figure',
  'hr',
  'li',
  'main',
  'ol',
  'p',
  'pre',
  'ul',
  'a',
  'abbr',
  'b',
  'bdi',
  'bdo',
  'br',
  'cite',
  'code',
  'data',
  'dfn',
  'em',
  'i',
  'kbd',
  'mark',
  'q',
  'rb',
  'rp',
  'rt',
  'rtc',
  'ruby',
  's',
  'samp',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
  'var',
  'wbr',
  'caption',
  'col',
  'colgroup',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  /*
    our own custom tags added to the default list
  */
  'img',
  'del'
];
export function cleanUp(dirtyHtml) {
  return sanitizeHtml(dirtyHtml, {
    allowedTags,
    allowedAttributes: {
      'a': ['href', 'target', 'data-application-action'],
      'h2': ['id'],
      'div': ['id'],
      'img': ['src', 'alt', 'title'],
      'th': ['scope'],
      '*': ['aria-hidden', 'aria-label']
    },
    allowedClasses: {
      'div': ['table-container'],
      'table': ['m-comparisonTable', 'm-comparison-table'],
      'td': ['yes', 'no'],
      '*': ['sr-only']
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel', 'sms'],
    transformTags: {
    // should strip out links with invalid hrefs
      'a': (tagName, attribs) => {
        if (isAttributeInvalid(attribs.href)) {
          delete attribs.href;
        }

        return {
          tagName,
          attribs
        };
      }
    },
    exclusiveFilter: frame => (frame.tag === 'img' && isAttributeInvalid(frame.attribs.src)) // should remove image tags with invalid src attributes
  });
}

/*
  SET cookies
  (COOKIE_NAME, COOKIE_VALUE, COOKIE_OPTIONS_OBJECT)
*/
export function setCookie(name, value, options, doc = document) {
  doc.cookie = cookie.serialize(name, value, options);
}

/*
  REMOVE cookies
  (COOKIE_NAME)
*/
export function removeCookie(name, domain, doc = document) {
  doc.cookie = cookie.serialize(name, null, { domain, path: '/', expires: new Date(EXPIRE_IMMEDIATE_COOKIE_TIME) });
}

/**
 * Strip string of special characters and consolidate whitespace
 * @param  {string} text String to clean up
 * @return {string}      cleaned string
 */
export function stripSpecialCharsConsolidateWhitespace(text) {
  return text
    .replace(/[^0-9a-z-_ ]/gi, '')
    .replace(/-+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^\s+/, '')
    .replace(/\s+$/, '');
}

/*
  Strip string of special characters and whitespace
*/
export function stripSpecialChars(text) {
  return text
    ? text.replace(/[^\w]/gi, '')
    : text;
}

/*
  Strip string of special characters and replace with '-'
  mainly used to ready text for analytics to parse
*/
export function stripSpecialCharsDashReplace(text) {
  return text
    ? text.trim().replace(/[^a-z0-9]+/gi, '-')
    : text;
}

/**
 * Sanitizes string for sending as an event payload- trims whitespace, replaces apostrophes, and converts whitespace to dashes
 */
export function sanitizeForEvent(string) {
  return (string || '')
    .trim()
    .replace(/'/g, '')
    .replace(/\s/g, '-');
}

/**
* Check whether url passed in is an absolute url or not
* @param {string}
*/
export function checkIfRelativeUrl(url) {
  return RELATIVE_URL_RE.test(url);
}

/**
 * Capitalize the first letter in a string.  Does not alter the rest of the string (to downcase the rest of the string use helpers/lodashReplacement#capitalize.
 * @str    {string} the string you want capitalized
 * @return {string} the string you passed in with the first character capital
 */
export const capitalize = str => {
  if (str) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
  }
};

export const indefiniteArticleSelector = str => {
  if (str && /^\w/.test(str)) {
    return /^[aeiou]/.test(str.charAt(0)) ? 'an' : 'a';
  }
};

/**
 * Pluralize a word
 * @param str string to pluralize
 * @param count how many items
 * @param revert return singular form of a plural input
 */
export const pluralize = memoize((str, count, revert) => {
  if (count === 1) {
    return str;
  }

  const plural = {
    '(quiz)$': '$1zes',
    '^(ox)$': '$1en',
    '([m|l])ouse$': '$1ice',
    '(matr|vert|ind)ix|ex$': '$1ices',
    '(x|ch|ss|sh)$': '$1es',
    '([^aeiouy]|qu)y$': '$1ies',
    '(hive)$': '$1s',
    '(?:([^f])fe|([lr])f)$': '$1$2ves',
    '(shea|lea|loa|thie)f$': '$1ves',
    'sis$': 'ses',
    '([ti])um$': '$1a',
    '(tomat|potat|ech|her|vet)o$': '$1oes',
    '(bu)s$': '$1ses',
    '(alias)$': '$1es',
    '(octop)us$': '$1i',
    '(ax|test)is$': '$1es',
    '(us)$': '$1es',
    '([^s]+)$': '$1s'
  };

  const singular = {
    '(quiz)zes$': '$1',
    '(matr)ices$': '$1ix',
    '(vert|ind)ices$': '$1ex',
    '^(ox)en$': '$1',
    '(alias)es$': '$1',
    '(octop|vir)i$': '$1us',
    '(cris|ax|test)es$': '$1is',
    '(shoe)s$': '$1',
    '(o)es$': '$1',
    '(bus)es$': '$1',
    '([m|l])ice$': '$1ouse',
    '(x|ch|ss|sh)es$': '$1',
    '(m)ovies$': '$1ovie',
    '(s)eries$': '$1eries',
    '([^aeiouy]|qu)ies$': '$1y',
    '([lr])ves$': '$1f',
    '(tive)s$': '$1',
    '(hive)s$': '$1',
    '(li|wi|kni)ves$': '$1fe',
    '(shea|loa|lea|thie)ves$': '$1f',
    '(^analy)ses$': '$1sis',
    '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': '$1$2sis',
    '([ti])a$': '$1um',
    '(n)ews$': '$1ews',
    '(h|bl)ouses$': '$1ouse',
    '(corpse)s$': '$1',
    '(us)es$': '$1',
    's$': ''
  };

  const irregular = {
    'move': 'moves',
    'foot': 'feet',
    'goose': 'geese',
    'sex': 'sexes',
    'child': 'children',
    'man': 'men',
    'tooth': 'teeth',
    'person': 'people',
    'this': 'these',
    'that': 'those',
    'criterion': 'criteria'
  };

  const uncountable = [
    'sheep',
    'fish',
    'deer',
    'moose',
    'series',
    'species',
    'media',
    'money',
    'rice',
    'information',
    'equipment',
    'garbage',
    'you',
    'wildlife',
    'staff'
  ];

  // Save some time in the case that singular and plural are the same
  if (uncountable.indexOf(str.toLowerCase()) >= 0) {
    return str;
  }

  // Check for irregular forms
  for (const word in irregular) {
    let pattern, replace;
    if (revert) {
      pattern = new RegExp(irregular[word] + '$', 'i');
      replace = word;
    } else {
      pattern = new RegExp(word + '$', 'i');
      replace = irregular[word];
    }
    if (pattern.test(str)) {
      return str.replace(pattern, replace);
    }
  }

  let array;
  if (revert) {
    array = singular;
  } else {
    array = plural;
  }

  // Check for matches using regular expressions
  for (const reg in array) {
    if (array.hasOwnProperty(reg)) {
      const pattern = new RegExp(reg, 'i');
      if (pattern.test(str)) {
        return str.replace(pattern, array[reg]);
      }
    }
  }

  return str;
});

/**
 * Opens new popup with given width/height dimensions from data-popup-options attribute
 * Example: <a href="" data-popup-options="width=400,height=600" onClick={openPopup}>Link</a>
 * @param event - click event
 * @param win - global window object
 * @returns {boolean}
 */
export const openPopup = (event, win = window) => {
  event.preventDefault();
  const { currentTarget, target } = event;
  let href;
  let popupOptions;
  const dataOptions = currentTarget.getAttribute('data-popup-options');
  if (currentTarget && dataOptions) {
    ({ href } = currentTarget);
    popupOptions = dataOptions;
  } else if (target && POPUP_CLASS_RE.test(target.className)) {
    const matches = target.className.match(POPUP_CLASS_RE);
    ({ href } = target);
    popupOptions = `width=${matches[1]},height=${matches[2]}`;
  }
  if (href) {
    const popup = win.open(href, '_blank', popupOptions);
    popup?.focus();
    return false;
  }
};

/**
 * Checks that a dom element has a css class and if not, adds it.
 * @param {Element} el         dom element
 * @param {String}  className  css class to check and add if needed
 */
export function ensureClass(el, className) {
  el.classList.contains(className) || el.classList.add(className);
}

/**
 * Checks that a dom element does NOT have a css class and if it does, removes it.
 * @param {Element} el         dom element
 * @param {String}  className  css class to check and remove if needed
 */
export function ensureNoClass(el, className) {
  el.classList.contains(className) && el.classList.remove(className);
}

/**
 * Use requestIdleCallback (or a fallback) to lazily postpone non-priority code
 * @callback {function} callback method you want loaded lazily
 */
export const lazyExecute = callback => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback);
  } else {
    const start = Date.now();
    return setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: function() {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, LAZY_TIMEOUT);
  }
};

/**
 * Convert an arbitrary number of arguments which may or may not be arrays into
 * a single array.
 * @param  {array} args
 * @return {array}
 */
export const arrayify = (...args) => args.reduce((acc, arg) => {
  const append = Array.isArray(arg) ? arg : [arg];
  return acc.concat(append);
}, []);

/**
 * Check if the page refferrer is external, i.e. navigated to Marty from an external site
 * @returns {boolean}
 */
export const isExternalReferrer = (win = window) => {
  if (typeof win.document === 'undefined') {
    return false;
  }
  return !win.document.referrer.includes(marketplace.siteDomain);
};

/**
 * Generate MSA image url
 * API: https://confluence.zappos.net/display/IN/Cloud+Catalog+API#CloudCatalogAPI-MSAimageinformation
 *
 * @param imageId          {string}        the MSA image ID
 * @param msaOpts          {object}        see confluence article above
 *        msaOpts.autoCrop {boolean}       see confluence article above
 *        msaOpts.width    {string|number} see confluence article above
 *        msaOpts.height   {string|number} see confluence article above
 * @param baseUrl          {string}        override the base URL of MSA
 * @return {string}
 */
const defaultMsaOpts = {
  extension: 'jpg',
  customSettings: ''
};

export const constructCollectionMSAImageUrl = (imageId, imageExtension, baseUrl = msaImagesUrl) => `${baseUrl}${imageId}._AC_.${imageExtension}`;

export const constructMSAImageUrl = (imageId, msaOpts, baseUrl = msaImagesUrl) => {
  if (!imageId) {
    return '';
  }
  msaOpts = { ...defaultMsaOpts, ...msaOpts };

  const autoCrop = msaOpts.autoCrop ? '_AC' : '';
  let dimensions = '';
  if (msaOpts.height && msaOpts.width) {
    dimensions = `_SR${msaOpts.width},${msaOpts.height}`;
  } else if (msaOpts.height) {
    dimensions = `_SY${msaOpts.height}`;
  } else if (msaOpts.width) {
    dimensions = `_SX${msaOpts.width}`;
  }
  const codes = (autoCrop || dimensions) ? `.${autoCrop}${dimensions}_` : '';

  return `${baseUrl}${imageId}${codes}${msaOpts.customSettings}.${msaOpts.extension}`;
};

export const originalLayeredMsaValues = {
  botH: 1200,
  botW: 1200,
  botX: 50,
  botY: 50,
  topH: 1300,
  topW: 1300,
  topX: 0,
  topY: 0
};
// Take number that is new h/w dimension. ex: 50
// Return obj w/ scaled measurements for other positionings
export const constructLayeredMsaImageSizingPositioning = dimension => Object.entries(originalLayeredMsaValues)
  .reduce((acc, [key, value]) => {
    acc[key] = Math.round(dimension * value / originalLayeredMsaValues.botH);
    return acc;
  }, {});

/**
 * Converts to png imageIds to a single layered jpg
 * jpg is much lighter than png
 */
export const constructLayeredMsaImageUrl = ({
  topImageId,
  botImageId,
  versionNumber = 'a', // arbitrary ID
  botH,
  botW,
  botX,
  botY,
  topH,
  topW,
  topX,
  topY,
  extension = 'png'
}) => {
  const opts = {
    customSettings: `._CL${versionNumber}|${topW},${topH}|${topImageId}.png|${botX},${botY},${botW},${botH}+${topX},${topY},${topW},${topH}_FMjpg`,
    extension
  };
  return constructMSAImageUrl(botImageId, opts);
};

/**
 * Filter and map an array in O(n) rather than O(2n)
 * Logically equivalent to array.filter(fn).map(fn2);
 * @param array array to filter and map
 * @param filterFunction function that takes an item in the array and determines whether it should be in the resulting array. returns truthy values
 * @param mapFunction function that transforms item in original array. Returns object for output array.
 * @returns Array
 */
export const filterThenMap = (array, filterFunction, mapFunction) => array.reduce((result, item) => {
  if (filterFunction(item)) {
    result.push(mapFunction(item));
  }
  return result;
}, []);

export const combineSideEffects = (...fns) => (...args) => {
  fns.forEach(fn => {
    fn && typeof fn === 'function' && fn(...args);
  });
};

export const checkJSEnabled = () => ensureClass(document.body, 'jsEnabled');

/**
 * JS modulus operator (%) doesn't work "correctly" for negative bases,
 * e.g.  -1 % 5 => -1, where the true math answer would be -1 % 5 => 4
 * This function gives us a true modulo answer.
 * @param a number left hand side of modulus
 * @param b number right hand side of modulus
 * @returns Number
 */
export const mod = (a, b) => ((a % b) + b) % b;

/**
 * Just a NO OPERATION function where a function handler is required but is otherwised unused.
 * @return {null}
 */
export const noop = () => null;
