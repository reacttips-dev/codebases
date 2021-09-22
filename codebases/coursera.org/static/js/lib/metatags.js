// CONSTANTS

// The following are set in /jade/meta.jade and should never change:
// - og_sitename
// - twitter:site
// - twitter:app:name:iphone
// - twitter:app:name:ipad
// - twitter:app:name:googleplay
// - twitter:app:id:iphone
// - twitter:app:id:ipad
// - twitter:app:id:googleplay
// - apple-itunes-app

const nameToTypeMapping = {
  'og:title': 'property',
  'og:url': 'property',
  'og:image': 'property',
  'og:description': 'property',
  'twitter:card': 'name',
  'twitter:title': 'name',
  'twitter:description': 'name',
  'twitter:image:src': 'name',
  description: 'name',
  image: 'name',
  keywords: 'name',
};

const DESC_MAX_LEN = 150;
const TWITTER_DESC_LEN = 60;

// FUNCTIONS

const nameToType = function (name) {
  return nameToTypeMapping[name] || 'name';
};

// based on stripTags in prototype.js
// https://github.com/sstephenson/prototype/blob/master/src/prototype/lang/string.js#L245-L280
const stripTags = function (str) {
  return (str || '').replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
};

/**
 * @param {String} rel type of relationship
 * @param {String} href absolute or relative URL
 */
const absolutize = function (href) {
  // FROM http://stackoverflow.com/a/14781678/46040
  const link = document.createElement('a');
  link.href = href;
  return link.protocol + '//' + link.host + link.pathname + link.search + link.hash;
};

const setLink = function (rel, href) {
  // assumes only ever one exists
  let link = document.querySelector('link[rel=' + rel + ']');
  if (!link) {
    // add it in
    link = document.createElement('link');
    document.head.appendChild(link);
  }

  // use absolute url as expected by Google
  const absoluteUrl = absolutize(href);

  // set both parts for consistency between cases
  link.setAttribute('rel', rel);
  link.setAttribute('href', absoluteUrl);
};

/**
 * Add <meta> tag, or replace if already exists
 */
const setMeta = function (name, value) {
  const selector = 'meta[' + nameToType(name) + '="' + name + '"]';
  // assumes only ever one exists
  let meta = document.querySelector(selector);

  if (!meta) {
    // add it in
    meta = document.createElement('meta');
    document.head.appendChild(meta);
  }

  // set both parts for consistency between cases
  meta.setAttribute(nameToType(name), name);
  const safeValue = stripTags(value + '');
  meta.setAttribute('content', safeValue);
};

const setMetaDict = function (dict) {
  for (const key in dict) {
    setMeta(key, dict[key]);
  }
};

/**
 * REF https://support.google.com/webmasters/answer/139066?hl=en#2
 * @param {String} url absolute or relative
 */
const setCanonical = function (url) {
  setLink('canonical', url.replace(/\/$/, ''));
};

// EXPORTS

export const set = setMetaDict;

export { setCanonical };

const limitDescriptionLength = (s, limit = DESC_MAX_LEN) => {
  return s.length > limit ? `${s.substring(0, s.lastIndexOf(String.fromCharCode(32), limit - 4) + 1)}...` : s;
};

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * PLEASE USE metatagsAddressBook.setMetatags({...}) INSTEAD *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Sets metadata for sharing, and since this is the canonical
 * URL to access this page, also sets the rel=canonical for SEO
 *
 * @param {Object} options - keys: title, description, pageHref, imageHref, keywords
 */
export const setCommon = function (options) {
  const newVals = {};

  if (options.title) {
    document.title = options.title;
    newVals['og:title'] = options.title;
    newVals['twitter:title'] = options.title;
    newVals['twitter:card'] = 'summary';
  }

  const metaDescription = limitDescriptionLength(options.description);
  const twitterMetaDescription = limitDescriptionLength(options.description, TWITTER_DESC_LEN);

  if (options.description) {
    newVals['og:description'] = metaDescription;
    newVals['twitter:description'] = twitterMetaDescription;
    newVals['twitter:card'] = 'summary';
    newVals.description = metaDescription;
  }

  if (options.pageHref) {
    setCanonical(options.pageHref); // can be relative

    const absolutePageUrl = absolutize(options.pageHref);
    newVals['og:url'] = absolutePageUrl; // requires absolute
  }

  if (options.imageHref) {
    const absoluteImageUrl = absolutize(options.imageHref);
    newVals['og:image'] = absoluteImageUrl;
    newVals.image = absoluteImageUrl;
    newVals['twitter:image:src'] = absoluteImageUrl;
    newVals['twitter:card'] = 'summary';
  }

  if (options.title || options.description || options.imageHref) {
    newVals['twitter:card'] = 'summary';
  }

  if (options.keywords && options.keywords.length > 0) {
    const keywordsAsString = typeof options.keywords === 'string' ? options.keywords : options.keywords.join(',');
    newVals.keywords = keywordsAsString;
  }

  setMetaDict(newVals);
};

/**
 * @deprecated
 * This function seems materially to be a no-op. It doesn't add any information
 * that's not already obvious to the bot.
 *
 * In the absence of other title metadata, any bot will look to <title>
 * which is what document.title is. Similarly, without any explicit
 * href metadata, it will just use whatever the page URL is.
 */
export const setDocumentDefault = function () {
  setCommon({
    title: document.title,
    pageHref: window.location.href,
  });
};

export default {
  set,
  setCanonical,
  setCommon,
  setDocumentDefault,
};
