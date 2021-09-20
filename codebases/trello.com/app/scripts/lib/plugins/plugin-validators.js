/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');

const isValidDataImage = (url) =>
  _.isString(url) &&
  /^data:image\/(?:png|jpg|jpeg|gif|svg\+xml);base64,[A-Za-z0-9+/=_-]+$/.test(
    url,
  );
const isValidHttp = (url) => _.isString(url) && /^https?:\/\//.test(url);
const isValidUrlForImage = (url) => isValidHttp(url) || isValidDataImage(url);

// when putting image URLs in CSS, we don't want you to be able
// to escape the CSS property with a ' or " and try to set other
// css properties behind our backs
const isValidUrlForCSSImage = (url) =>
  isValidUrlForImage(url) && !/['"]/.test(url);

const isValidUrlForIframe = (url) => isValidHttp(url);

const isValidHeight = function (height, maxHeight, minHeight) {
  if (maxHeight == null) {
    maxHeight = Infinity;
  }
  if (minHeight == null) {
    minHeight = 1;
  }
  if (height == null || !_.isNumber(height)) {
    return false;
  }
  return height >= minHeight && height <= maxHeight;
};

const isValidHexColor = function (colorString) {
  if (
    _.isString(colorString) &&
    /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(colorString)
  ) {
    return true;
  }

  return false;
};

// Expected Shape of pluginBadge:
//   icon?: url
//   text?: string | number
//   title?: string (cardDetail)
//   color?: string
//   dynamic?: function
//   refresh?: number
//   callback?: function (cardDetail)
//   url?: string (cardDetail)
//   target?: string (cardDetail)
const isValidBadge = function (pluginBadge) {
  if (pluginBadge == null || !_.isObject(pluginBadge)) {
    return false;
  }
  if (
    pluginBadge.text != null &&
    !_.isString(pluginBadge.text) &&
    !_.isFinite(pluginBadge.text)
  ) {
    return false;
  }
  if (pluginBadge.title != null && !_.isString(pluginBadge.title)) {
    return false;
  }
  if (pluginBadge.icon != null && !isValidUrlForCSSImage(pluginBadge.icon)) {
    return false;
  }
  if (pluginBadge.dynamic != null && !_.isFunction(pluginBadge.dynamic)) {
    return false;
  }
  if (pluginBadge.refresh != null && !_.isFinite(pluginBadge.refresh)) {
    return false;
  }

  return true;
};

const isValidCardBackSection = function (section) {
  const errorMessages = [];
  if (!_.isObject(section)) {
    return false;
  }
  let ok = true;
  if (!_.isString(section.title)) {
    ok = false;
    errorMessages.push('Missing valid title.');
  }
  if (!_.isString(section.icon)) {
    ok = false;
    errorMessages.push('Missing valid icon.');
  }
  if (!_.isObject(section.content)) {
    ok = false;
    errorMessages.push('Missing valid content property.');
  }
  if (section.content?.type !== 'iframe') {
    ok = false;
    errorMessages.push("Content type must be 'iframe'.");
  }
  if (!isValidUrlForIframe(section.content?.url)) {
    ok = false;
    errorMessages.push('Missing valid content url.');
  }
  if (!ok) {
    const finalErrors = errorMessages.join('\n');
    if (typeof console !== 'undefined' && console !== null) {
      console.error(`Failed to load card back section in plugin ${section.idPlugin}: \
\n\n${finalErrors} \
\n\nSee https://developers.trello.com/reference/#card-back-section`);
    }
  }
  return ok;
};

const isValidAttachmentSections = function (section, attachmentList) {
  const errorMessages = [];
  if (!_.isObject(section)) {
    return false;
  }
  let ok = true;
  if (!_.isString(section.icon)) {
    if (typeof console !== 'undefined' && console !== null) {
      console.warn(`Warning in plugin ${section.idPlugin}: \
Attachment sections icon is missing.`);
    }
  }
  if (!_.isObject(section.content)) {
    ok = false;
    errorMessages.push('Missing valid content property.');
  }
  if (!isValidUrlForIframe(section.content?.url)) {
    ok = false;
    errorMessages.push('Missing valid content url.');
  }
  if (!_.isArray(section.claimed)) {
    ok = false;
    errorMessages.push('Missing valid claimed property.');
  }
  if (
    !_.every(
      section.claimed,
      (entry) => entry?.id != null && attachmentList.get(entry.id) != null,
    )
  ) {
    ok = false;
    errorMessages.push("Missing id's in claimed entries.");
  }
  if (!ok) {
    const finalErrors = errorMessages.join('\n');
    if (typeof console !== 'undefined' && console !== null) {
      console.error(`Failed to load attachment sections in plugin ${section.idPlugin}: \
\n\n${finalErrors} \
\n\nSee https://developers.trello.com/reference/#attachment-sections`);
    }
  }
  if (section.claimed?.length === 0) {
    ok = false;
  }
  return ok;
};

const isRenderableBadge = function (pluginBadge, cardDetail) {
  // do we have enough data in this badge to render something meaningful
  if (!isValidBadge(pluginBadge, cardDetail)) {
    return false;
  }
  if (cardDetail) {
    // card detail badges need at least text
    // should it also require a title?
    // probably, but we haven't been enforcing that so :shrug:
    return _.isString(pluginBadge.text) || _.isFinite(pluginBadge.text);
  } else {
    // card front badge need at least text or an icon
    return (
      isValidUrlForCSSImage(pluginBadge.icon) ||
      _.isString(pluginBadge.text) ||
      _.isFinite(pluginBadge.text)
    );
  }
};

// Expected Shape of pluginCover:
//   height: Number
//   url: string
//   edgeColor?: string
//   position?: 'cover' | { padding: boolean, align: 'left'|'right'|'center'}
const isValidCover = function (pluginCover, cardDetail) {
  const MAX_HEIGHT = 256;
  const MIN_HEIGHT = cardDetail ? 64 : 8;
  if (pluginCover == null || !_.isObject(pluginCover)) {
    return false;
  }
  if (!isValidUrlForCSSImage(pluginCover.url)) {
    if (typeof console !== 'undefined' && console !== null) {
      console.warn('Invalid URL supplied for card-cover', pluginCover.url);
    }
    return false;
  }
  if (!isValidHeight(pluginCover.height, MAX_HEIGHT, MIN_HEIGHT)) {
    if (typeof console !== 'undefined' && console !== null) {
      console.warn(
        'Invalid height supplied for card-cover',
        pluginCover.height,
      );
    }
    return false;
  }

  return true;
};

const isValidAlertDisplayType = (displayType) =>
  ['info', 'success', 'warning', 'error'].includes(displayType);

const isValidAlertDuration = (duration) =>
  _.isNumber(duration) && duration >= 5 && duration <= 30;

const isValidStringLength = (str, min, max) =>
  _.isString(str) && str.length >= min && str.length <= max;

const isValidPosition = (pos) =>
  _.isObject(pos) && _.isFinite(pos.x) && _.isFinite(pos.y);

const isValidUrlUnfurl = function (unfurl) {
  if (unfurl == null) {
    return false;
  }
  if (!_.isString(unfurl.text) || unfurl.text.trim().length === 0) {
    return false;
  }
  let hasNewProperty = false;
  if (unfurl.icon != null && !isValidUrlForCSSImage(unfurl.icon)) {
    return false;
  }
  if (unfurl.thumbnail != null) {
    if (!isValidUrlForCSSImage(unfurl.thumbnail)) {
      return false;
    }
    hasNewProperty = true;
  }
  if (unfurl.image != null) {
    if (!isValidUrlForCSSImage(unfurl.image?.url)) {
      return false;
    }
    if (
      (unfurl.image?.size && !_.isString(unfurl.image.size)) ||
      (unfurl.image?.x && !_.isString(unfurl.image.x)) ||
      (unfurl.image?.y && !_.isString(unfurl.image.y))
    ) {
      return false;
    }
  }

  if (unfurl.actions != null) {
    if (!_.isArray(unfurl.actions)) {
      return false;
    }
    if (
      !unfurl.actions.every(
        (a) =>
          (_.isString(a.text) && !a.url && _.isFunction(a.callback)) ||
          (isValidHttp(a.url) && !_.isFunction(a.callback)),
      )
    ) {
      return false;
    }
    if (unfurl.actions.length > 0) {
      hasNewProperty = true;
    }
  }
  if (unfurl.subtext != null) {
    if (!_.isString(unfurl.subtext)) {
      return false;
    }
    if (unfurl.subtext.trim().length > 0) {
      hasNewProperty = true;
    }
  }
  return hasNewProperty;
};

const isValidSaveAttachment = function (saveAttachment) {
  if (saveAttachment == null) {
    return false;
  }
  let hasCallback = false;
  if (saveAttachment.callback != null) {
    if (_.isFunction(saveAttachment.callback)) {
      hasCallback = true;
    }
  }
  return hasCallback;
};

module.exports = {
  isRenderableBadge,
  isValidAlertDisplayType,
  isValidAlertDuration,
  isValidAttachmentSections,
  isValidBadge,
  isValidCardBackSection,
  isValidCover,
  isValidHeight,
  isValidHttp,
  isValidHexColor,
  isValidPosition,
  isValidStringLength,
  isValidUrlForCSSImage,
  isValidUrlForIframe,
  isValidUrlForImage,
  isValidUrlUnfurl,
  isValidSaveAttachment,
};
