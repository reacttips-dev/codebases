import ExecutionEnvironment from 'exenv';

import { getScreenSize } from 'helpers/HtmlHelpers';

export const DESKTOP_CARD_WIDTH_THRESHOLD = 1200;

/**
 * Based on the CSS breakpoint width, is this a desktop experience?
 * @return {Boolean}
 */
export const isDesktop = () => ExecutionEnvironment.canUseDOM && getScreenSize() !== 'mobile';

/**
 * Based on the screen width, is this a card desktop
 * @param  {object}  [win=global.window]
 * @return {Boolean}
 */
export const isCardDesktop = (win = global.window) => win?.innerWidth > DESKTOP_CARD_WIDTH_THRESHOLD;

/**
 * Get the force refresh routing configuration for the given marketplace and
 * platform.
 * @param  {object}  marketplace
 * @param  {Boolean} [onDesktop=isDesktop()]
 * @return {object}
 */
export const getForceRefreshConfig = (marketplace, onDesktop = isDesktop()) => {
  const { features: { forceRefresh: { mobile, desktop } } } = marketplace;
  return onDesktop ? desktop : mobile;
};

/**
 * Get the (archaic) subsiteId for the given marketplace and platform.
 * @param  {object}  marketplace
 * @param  {Boolean} [onDesktop=isDesktop()]
 * @return {number}
 */
export const getSubsiteId = (marketplace, onDesktop = isDesktop()) => {
  const { subsiteId: { desktop, mobile } } = marketplace;
  return onDesktop ? desktop : mobile;
};

/**
 * Determine if the given type of page is configured to be force refreshed for
 * the given marketplace and platform.
 * @param  {object}  marketplace
 * @param  {string}  type
 * @param  {Boolean} [onDesktop=isDesktop()]
 * @return {Boolean}
 */
export const isForceRefreshed = (marketplace, type, onDesktop = isDesktop()) => {
  const result = getForceRefreshConfig(marketplace, onDesktop)[type];
  return typeof result !== 'undefined' ? result : true;
};

/**
 * Attempt to save an item to the session storage.
 * @param key
 * @param value
 */
export const saveToSessionStorage = (key, value) => {
  try {
    sessionStorage.setItem(key, value);
  } catch (err) {
    // Session storage is not available
  }
};

/**
 * Attempt to remove an item from the session storage.
 * @param key
 */
export const removeFromSessionStorage = key => {
  try {
    sessionStorage.removeItem(key);
  } catch (err) {
    // Session storage is not available
  }
};

/**
 * Attempt to get an item from the session storage
 * @param key
 * @return {object}
 */
export const getFromSessionStorage = (key, fallback = {}) => {
  try {
    return JSON.parse(sessionStorage.getItem(key)) || fallback;
  } catch (err) {
    return fallback;
  }
};

/**
 * Smooth scroll to an element.
 * @param {node} element to scroll to
 * @param {callback} callback function
 */
export const smoothScroll = {
  timer: null,

  stop: function() {
    clearTimeout(this.timer);
  },

  scrollTo: function(node, options, callback) {
    const settings = {
      duration: 1000,
      extraOffset: 0,
      easing: {
        outQuint: function(x, t, b, c, d) {
          return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        }
      },
      ...options
    };
    let percentage;
    const startTime = Date.now();
    const rect = node.getBoundingClientRect();
    // Cross-browser fix for scrollTop
    const nodeTop = rect.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
    const nodeHeight = node.offsetHeight;
    const { body } = document;
    const html = document.documentElement;
    const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowHeight = window.innerHeight;
    const offset = window.pageYOffset;
    const delta = nodeTop - offset;

    const bottomScrollableY = height - windowHeight;
    const targetY = (bottomScrollableY < delta) ?
      bottomScrollableY - (height - nodeTop - nodeHeight + offset) :
      delta;

    percentage = 0;

    if (this.timer) {
      clearInterval(this.timer);
    }

    function step() {
      let yScroll;
      const elapsed = Date.now() - startTime;

      if (elapsed > settings.duration) {
        clearTimeout(this.timer);
      }

      percentage = elapsed / settings.duration;

      if (percentage > 1) {
        clearTimeout(this.timer);

        if (callback) {
          callback();
        }
      } else {
        yScroll = settings.easing.outQuint(0, elapsed, (offset - settings.extraOffset), targetY, settings.duration);
        window.scrollTo(0, yScroll);
        this.timer = setTimeout(step, 10);
      }
    }

    this.timer = setTimeout(step, 10);
  }
};

/**
 * Get the position of an element relative to the document
 * @param el {element}
 */
export const offset = el => {
  if (el) {
    const rect = el.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      height: rect.height,
      width: rect.width
    };
  } else {
    return {};
  }
};

/**
 * Get a string which is the pathname and search components of the current url.
 * @param {object} window (optional)
 * @returns {string} A string of the current pathname and search
 */
export const currentPathAndSearch = (win = window) => `${win.location.pathname}${win.location.search}`;

/**
 * Builds an openLiveChat method with the specified window and analytics parameters.
 *
 * @param  {String} windowName [description]
 * @param  {String} eventName [description]
 * @param  {String} eventCategory [description]
 * @return {Function}              [description]
 */
export const makeOpenLiveChat = windowName => e => {
  e.preventDefault();

  const halfHeight = 325,
    halfWidth = 230,
    height = 650,
    left = (window.screen.width * .5) - halfWidth,
    top = (window.screen.height * .5) - halfHeight,
    width = 460;

  // DEV-32299 Setting for live chat popup from Kirk (Journey Stack) to hook into on close.
  window.name = windowName;

  const settings = `status=no,toolbar=no,location=yes,menubar=no,directories=no,scrollbars=yes,resizable=yes,width=${width},height=${height},top=${top},left=${left}`;
  window.open(e.currentTarget.href || e.target.href, 'LiveChat', settings);
};

export const isNotBot = userAgent => !/bot/i.test(userAgent);

/**
 * Same as `getPageLang` except you must pass in the document object. Use
 * `getPageLang` instead.
 */
export function getPageLangFromDocumentObject(document) {
  let pageLang = document?.documentElement?.lang;
  pageLang = pageLang && pageLang.split('-')[0];
  return pageLang || 'en';
}

/**
 * Gets the page language if the html element's lang attribute is set, else
 * return 'en'.
 */
export function getPageLang() {
  return getPageLangFromDocumentObject(ExecutionEnvironment.canUseDOM ? document : {});
}

/**
 * Gets the page title
 */
export function getPageTitle(document = {}) {
  const { title = '' } = document;
  return ExecutionEnvironment.canUseDOM && escape(title);
}

/* Explanation of the regex constant declared below:
Summary: Extract the p parameter value in a url.  Capture certain parts of it for a later replacement.

/(.*)?\?(.*)(&)?p=(\d*)(?:&)?(.*)/
  $1     $2  $3    $4         $5

(.*)  = $1, the whole url up to the '?' parameter separator.
(.*)  = $2, all parameters preceeding 'p'.
(&)   = $3, any ampersand preceeding 'p'.
(\d*) = $4, the actual 'p' parameter value.
(.*)  = $5, the rest of the parameters after 'p'.
*/
const EXTRACT_PAGE_PARAM_RE = /(.*)?\?(.*)(&)?p=(\d*)(?:&)?(.*)/;
const PAGE_PARAM_TO_PATH_SUB_STRING = '$1/page/$4?$2$5';
// Ex.  convertPageParamToUrlPath("zappos.com?p=3") yields "zappos.com/page/3".
export const convertPageParamToUrlPath = url => url && url
  .replace(EXTRACT_PAGE_PARAM_RE, PAGE_PARAM_TO_PATH_SUB_STRING)
  .replace('//page', '/page') // Double slashes may appear if /page is the only path segment in the url.
  .replace(/\?$/, ''); // Remove trailing '?' when there are no other parameters.

/*
 * Generic method for triggering events cross browser.
 */
export const triggerEvent = (target, type) => {
  const doc = window.document;
  if (doc.createEvent) {
    const event = doc.createEvent('HTMLEvents');
    event.initEvent(type, true, true);
    target.dispatchEvent(event);
  }
};

/*
 * We create this URL in more than one place. Single source of truth.
 */
export const createYouTubeContentUrl = youtubeVideoId => `https://www.youtube.com/watch?v=${youtubeVideoId}`;
