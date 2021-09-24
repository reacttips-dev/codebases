'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import I18n from 'I18n';
import { Set as ImmutableSet, List } from 'immutable';
import { ACCOUNT_TYPES, BROADCAST_VALIDATION_ERRORS, FACEBOOK_BASE_URL, MAX_IMAGE_BYTES, MAX_IMAGE_BYTES_ANIMATED, MAX_IMAGE_BYTES_DEFAULT, ACCOUNT_TYPE_TO_MAX_VIDEO_SIZE_BYTES, ACCOUNT_TYPE_TO_MIN_VIDEO_SIZE_BYTES, MAX_VIDEO_SIZE_BYTES_DEFAULT, TWITTER_BASE_URL, CHANNEL_VALIDATION, TAG_STATUS, LINKEDIN_MENTION_PATTERN, FACEBOOK_MENTION_PATTERN, INSTAGRAM_MENTION_PATTERN, LINKEDIN_MENTION_WITHOUT_URN_PATTERN, LINKEDIN_URN_PREFIX, LINKEDIN_BASE_URL, INSTAGRAM_BASE_URL, CHANNEL_TYPES, BROADCAST_MEDIA_TYPE, POST_STAT_TYPES, CLICK_TRACKING_CHANNEL_TYPES, STAT_PLACEHOLDERS, BROADCAST_STATUS_TYPE_TO_STATUS_TAG_PROPS } from './constants';
import { parse } from 'hub-http/helpers/params';
import TwitterText from 'twitter-text';
import { some, escape, memoize, pick } from 'underscore';
import enviro from 'enviro';
import { weekTimeRowHeight } from 'ui-addon-calendars/constants/sizes';
import ViewTypes from 'ui-addon-calendars/constants/CalendarViewTypes';
import trimHtml from '../vendor/trim-html';
import Raven from 'Raven';
export function lpad(str, padString, length) {
  while (str.length < length) {
    str = padString + str;
  }

  return str;
}
var reportedMessages = [];
export function logErrorMessageOnce(message, extra) {
  if (!reportedMessages.includes(message)) {
    console.warn(message, {
      extra: extra
    });
  }

  reportedMessages.push(message);
}
export function getNetworkProfileLink(network, userId, userName) {
  if (network === ACCOUNT_TYPES.facebook && (userId || userName)) {
    return FACEBOOK_BASE_URL + "/" + (userName || userId);
  } else if (network === ACCOUNT_TYPES.twitter && userName) {
    return TWITTER_BASE_URL + "/" + userName;
  }

  return null;
}
export function momentToMinutes(moment) {
  var mmtMidnight = moment.clone().startOf('day');
  return moment.diff(mmtMidnight, 'minutes');
}
export function getNotificationFor(actionType) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'danger';
  var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  context.count = context.count || 1;
  var errorObj = I18n.text("sui.notifications." + actionType.toLowerCase());

  if (!errorObj) {
    return null;
  }

  var message = type === 'success' ? I18n.text("sui.notifications." + actionType.toLowerCase() + ".success", context) : I18n.text("sui.notifications." + actionType.toLowerCase() + ".message", context);
  errorObj = {
    id: actionType,
    titleText: I18n.text("sui.notifications.titles." + type),
    message: message,
    type: type
  };
  return errorObj;
}

function _validateLocalFileSizeForVideo(file, network) {
  var errors = ImmutableSet();

  if (ACCOUNT_TYPE_TO_MAX_VIDEO_SIZE_BYTES[network]) {
    if (file.size > ACCOUNT_TYPE_TO_MAX_VIDEO_SIZE_BYTES[network]) {
      errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoSizeTooLarge);
    } else if (ACCOUNT_TYPE_TO_MIN_VIDEO_SIZE_BYTES[network] && file.size < ACCOUNT_TYPE_TO_MIN_VIDEO_SIZE_BYTES[network]) {
      errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoSizeTooSmall);
    }
  } else if (file.size > MAX_VIDEO_SIZE_BYTES_DEFAULT) {
    errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoSizeTooLarge);
  }

  return errors;
}

function _validateLocalFileSizeForNonVideo(file, network) {
  var errors = ImmutableSet();
  var maxBytesMaybe = List([MAX_IMAGE_BYTES_ANIMATED[network], MAX_IMAGE_BYTES[network]]).filter(function (x) {
    return x;
  }).max();

  if (maxBytesMaybe) {
    if (file.size > maxBytesMaybe) {
      errors = errors.add(BROADCAST_VALIDATION_ERRORS.imageSizeTooLarge);
    }
  } else if (file.size > MAX_IMAGE_BYTES_DEFAULT) {
    errors = errors.add(BROADCAST_VALIDATION_ERRORS.imageSizeTooLarge);
  }

  return errors;
}
/**
 * Validates an image, video, etc via drag and drop
 * Unlike FmFile.validateForMessage, validation here is limited as we only have limited info like extension and filesize
 */


export function validateLocalFile(file, network) {
  var allowedExtensions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var extraData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var errors = ImmutableSet();
  var ext = getExtensionFromString(file.name);

  if (allowedExtensions.size && !allowedExtensions.includes(ext)) {
    errors = errors.add(BROADCAST_VALIDATION_ERRORS.invalidExtension);
  } else if (extraData && !extraData.getAddableExtensions().includes(ext)) {
    errors = errors.add(BROADCAST_VALIDATION_ERRORS.mixMultiImageFileTypes);
  }

  if (file.type && file.type.startsWith('video/')) {
    errors = errors.concat(_validateLocalFileSizeForVideo(file, network));
  } else {
    errors = errors.concat(_validateLocalFileSizeForNonVideo(file, network));
  }

  return errors;
}
export function channelKeyDifference(keys, selectedKeys) {
  return keys.subtract(selectedKeys);
}
export function getDomain(url) {
  var anchor = document.createElement('a');
  anchor.href = url;
  return anchor.protocol + "//" + anchor.hostname;
}
export function generateUID() {
  // I generate the UID from two parts here
  // to ensure the random number provide enough bits.
  var firstPart = Math.random() * 46656 | 0;
  var secondPart = Math.random() * 46656 | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}
export function hasUrlFlag() {
  return window.location.hash.indexOf('secretBeta=1') >= 0;
}
export function sanitizeTwitterHandle(handle) {
  // This removes all non-alphanumeric or underscore characters that the
  // backend can't handle, such as '@'
  return handle.replace(/[\W]+/g, '');
}
export function isFacebookOrInstagramChannel(accountSlug) {
  return accountSlug === ACCOUNT_TYPES.instagram || accountSlug === ACCOUNT_TYPES.facebook;
}
export function getStatusTagType(errors) {
  return errors.some(function (error) {
    return error === CHANNEL_VALIDATION.EXPIRED || error === CHANNEL_VALIDATION.FB_PAGE_PERMISSIONS || error === CHANNEL_VALIDATION.INSTAGRAM_PERMISSIONS;
  }) ? TAG_STATUS.ERROR : TAG_STATUS.WARNING;
}
export function processMessageContentWithEmojis() {
  import(
  /* webpackChunkName: "social-emoji" */
  '../emoji/lib/utils').then(function (emojiUtils) {
    window.emojiUtils = emojiUtils;
  });
  var html = processMessageContent.apply(void 0, arguments);

  if (window.emojiUtils) {
    html = window.emojiUtils.wrapEmojis(html);
  }

  return html;
}
export function getFilteredGates(gates) {
  return ImmutableSet(gates.filter(function (g) {
    return g.startsWith('Social:') || g.startsWith('Broadcast:') || g.startsWith('Ads:');
  }));
}
export function closestElement(element, selector) {
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }

  while (element && element.nodeType === 1) {
    if (element.matches(selector)) {
      return element;
    }

    element = element.parentNode;
  }

  return null;
}
export var isValidEmail = function isValidEmail(email) {
  var regex = /\S+@\S+\.\S+/;
  return regex.test(email);
};
export var isUrlPartOfEmail = function isUrlPartOfEmail(_ref) {
  var item = _ref.item,
      text = _ref.text;
  var start = item.indices[0];

  var _text$slice$split = text.slice(start).split(/\s/),
      _text$slice$split2 = _slicedToArray(_text$slice$split, 1),
      slicedWord = _text$slice$split2[0];

  return isValidEmail(slicedWord);
};
export var getValidUrlsInText = function getValidUrlsInText(textValue) {
  var linkedinMentions = textValue.match(LINKEDIN_MENTION_PATTERN);
  var facebookMentions = textValue.match(FACEBOOK_MENTION_PATTERN); // Ignores any urls that are part of a LinkedIn mention

  return TwitterText.extractUrlsWithIndices(textValue).filter(function (item) {
    return !isUrlPartOfEmail({
      item: item,
      text: textValue
    });
  }).filter(function (item) {
    return !some(linkedinMentions, function (mention) {
      return mention.includes(item.url);
    }) && !some(facebookMentions, function (mention) {
      return mention.includes(item.url);
    });
  }).map(function (item) {
    return item.url;
  });
};

var urlIsAtEnd = function urlIsAtEnd(body, url) {
  var bodySplitByUrl = body.trim().split(url);
  var lastPartOfBody = bodySplitByUrl[bodySplitByUrl.length - 1];

  if (lastPartOfBody !== null && lastPartOfBody === '') {
    return true;
  }

  return false;
};

export var clearEndOfBodyUrl = function clearEndOfBodyUrl(body, network) {
  var urlsInBody = getValidUrlsInText(body);

  if (network === ACCOUNT_TYPES.facebook || urlsInBody.length > 1 && network !== ACCOUNT_TYPES.twitter) {
    return body;
  }

  var urlToRemove = urlsInBody.find(function (url) {
    return urlIsAtEnd(body, url);
  });
  return body.replace(urlToRemove, '');
};
export var getCleanRootUrl = function getCleanRootUrl(url) {
  var newUrl = url.split('://').pop().split('www.').pop().split('/');
  return newUrl ? newUrl[0] : null;
};
export function getRelativeDroppedMoment(_ref2) {
  var containerRef = _ref2.containerRef,
      droppedMoment = _ref2.droppedMoment,
      eventDate = _ref2.eventDate,
      monitor = _ref2.monitor,
      viewType = _ref2.viewType;
  var hourDiff = 0;
  var minute = 0;
  var eventDateMoment = I18n.moment.utc(eventDate).portalTz();

  if (viewType !== ViewTypes.MONTH) {
    // if week/day view we're:
    // - setting the hour diff
    // - leaving minutes to 0
    var offsetY = monitor.getClientOffset().y - containerRef.current.getBoundingClientRect().top + weekTimeRowHeight / 2;
    hourDiff = Math.floor(offsetY / weekTimeRowHeight) - eventDateMoment.hours() - 1;
  } else {
    // if month view we're:
    // - leaving the hour diff to 0
    // - setting the minute to the event current minutes
    minute = eventDateMoment.minute();
  }

  return droppedMoment.hour(eventDateMoment.hour()).add(hourDiff, 'hours').minute(minute).second(0).millisecond(0);
}
export var safeCallHSFeedback = function safeCallHSFeedback(functionToRun) {
  var safeRunFunction = function safeRunFunction() {
    if (!window.hsFeedback || !window.hsFeedback.loadSurvey) {
      window.setTimeout(safeRunFunction, 1000);
      return;
    }

    functionToRun();
  };

  if (!enviro.isQa()) {
    safeRunFunction();
  }
};
export var getCurrentSurveyConfig = function getCurrentSurveyConfig() {
  var surveyConfig = window.hsFeedback.getSurveyConfig() || {};
  return surveyConfig.config || null;
};
export var triggerSurvey = function triggerSurvey(surveyId) {
  safeCallHSFeedback(function () {
    var currentConfig = getCurrentSurveyConfig();

    if (!currentConfig || currentConfig.surveyId !== surveyId) {
      window.hsFeedback.loadSurvey('CSAT', surveyId);
    } else {
      window.hsFeedback.show();
    }
  });
};
export var generatePostUrlId = function generatePostUrlId(post) {
  return post.channelSlug + ":" + post.channelId + ":" + post.foreignId;
};
var MAX_MESSAGE_LENGTH = 280;
var TRUNCATE_URL_LIMIT = 60;
export var twitterTxtOptions = {
  targetBlank: true,
  usernameClass: 'tweet-url tweet-username' // do not conflict with the class we use for screennames

};
var instagramOptions = {
  targetBlank: true,
  hashtagUrlBase: 'https://www.instagram.com/explore/tags/',
  usernameUrlBase: 'https://www.instagram.com/',
  usernameClass: 'ig-username'
};

function _escape(str) {
  return escape(str).replace(/&amp;/g, '&');
}

function parseHTML(str) {
  var tmp = document.implementation.createHTMLDocument('');
  tmp.body.innerHTML = str;
  return tmp.body.children;
}

export function formatTweet(text, options) {
  options = Object.assign({}, twitterTxtOptions, {}, options);
  return TwitterText.autoLink(escape(text), options).replace(/\s\s+/g, ' ').replace(/\n/g, '<br/>');
} // process broadcast content for display (safely)

export function processMessageContent(message) {
  var truncate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var maxLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : MAX_MESSAGE_LENGTH;
  var network = arguments.length > 3 ? arguments[3] : undefined;

  if (!message) {
    return '';
  }

  message = truncate ? // removes trailing spaces and braille pattern blank, which is commonly
  // used as a whitespace character in instagram captions
  message.replace(/\s\s+/g, ' ').replace(/\u2800/g, '') : message;
  message = _escape(message);

  if (network === ACCOUNT_TYPES.twitter) {
    message = TwitterText.autoLink(message, twitterTxtOptions);
  } else if (network === ACCOUNT_TYPES.instagram) {
    message = TwitterText.autoLinkHashtags(message, instagramOptions);
    message = message.replace(INSTAGRAM_MENTION_PATTERN, function (match) {
      return "<a href=\"" + getNetworkUrl(ACCOUNT_TYPES.instagram, match.replace('@', '')) + "\" target=\"_blank\">" + match + "</a>";
    });
  } else {
    message = TwitterText.autoLinkUrlsCustom(message, twitterTxtOptions);
  }

  if (network === ACCOUNT_TYPES.facebook) {
    message = message.replace(FACEBOOK_MENTION_PATTERN, function (match, pageId, name) {
      return "<a href=\"" + getNetworkUrl(ACCOUNT_TYPES.facebook, pageId) + "\" target=\"_blank\">" + name + "</a>";
    });
  } else if (network === ACCOUNT_TYPES.linkedin) {
    message = message.replace(LINKEDIN_MENTION_PATTERN, function (match, companyId, name) {
      name = name.replace(LINKEDIN_URN_PREFIX, '');
      return "<a href=\"" + getNetworkUrl(ACCOUNT_TYPES.linkedin, companyId) + "\" target=\"_blank\">" + name + "</a>";
    });
    message = message.replace(LINKEDIN_MENTION_WITHOUT_URN_PATTERN, function (match, companyId, name) {
      return "<a href=\"" + getNetworkUrl(ACCOUNT_TYPES.linkedin, companyId) + "\" target=\"_blank\">" + name + "</a>";
    });
  }

  var html = message.replace(/\n/g, '<br />');

  if (truncate) {
    html = trimHtml(message, {
      limit: maxLength
    }).html;
    var parsedHtml = parseHTML("<div>" + html + "</div>")[0];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = parsedHtml.querySelectorAll('a')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var anchor = _step.value;

        if (anchor.href.length > TRUNCATE_URL_LIMIT) {
          anchor.title = anchor.href;
          anchor.textContent = anchor.href.substr(0, TRUNCATE_URL_LIMIT) + "...";
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    html = parsedHtml.innerHTML;
  }

  return html;
}
export var getURLQuery = function getURLQuery() {
  if (!location.search) return {};
  var queryString = location.search.slice(1);
  return parse(queryString);
};
export var getQueryParam = function getQueryParam(paramName) {
  var _document = document,
      location = _document.location;
  if (!location.search) return null;
  var params = getURLQuery();
  return params[paramName];
};
export var safeGetArrayQueryParam = function safeGetArrayQueryParam(paramName) {
  var param = getQueryParam(paramName);
  param = param ? param.split(',') : [];
  return param;
};
/**
 * Returns whether or not any side panel is open.
 * This includes the Composer, Broadcast Details Panel, and Post Details Panel.
 * This is most useful when we don't want to start a tour or show a modal
 * when a side panel is already overlaid on top of existing content
 *
 * @returns {boolean} Whether or not any side panel is open
 */

export function isAnySidePanelOpen() {
  var isBroadcastDetailsPanelOpen = Boolean(getQueryParam('broadcast'));
  var isComposerOpen = Boolean(getQueryParam('composer'));
  var isPostDetailsPanelOpen = Boolean(getQueryParam('post'));
  return isBroadcastDetailsPanelOpen || isComposerOpen || isPostDetailsPanelOpen;
}
export var getDefaultSortOrder = function getDefaultSortOrder(sortBy) {
  return sortBy === 'scheduledFor' ? 'asc' : 'desc';
};
var PROTOCOL_REGEX = /^https?:\/\//i;
export function ensureProtocol(url) {
  if (!PROTOCOL_REGEX.test(url)) {
    return "http://" + url;
  }

  return url;
}
export function getDurationDisplay(msDuration) {
  var ignoreZeroHours = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var m = I18n.moment('1900-01-01 00:00:00').add(msDuration, 'ms');
  var minHoursDisplay = ignoreZeroHours ? 60 * 60 * 1000 : 60 * 1000;
  return msDuration > minHoursDisplay ? m.format('HH:mm:ss') : m.format('mm:ss');
}
export function getNetworkUrl(network, id) {
  switch (network) {
    case ACCOUNT_TYPES.twitter:
      return TWITTER_BASE_URL + "/" + id;

    case ACCOUNT_TYPES.facebook:
      return FACEBOOK_BASE_URL + "/" + id;

    case ACCOUNT_TYPES.linkedin:
      return LINKEDIN_BASE_URL + "/company/" + id;

    case ACCOUNT_TYPES.instagram:
      return INSTAGRAM_BASE_URL + "/" + id;

    default:
      return null;
  }
}
export function rpad(str, padString, length) {
  while (str.length < length) {
    str = str + padString;
  }

  return str;
}
export function passPropsFor(props, componentCls) {
  if (componentCls.WrappedComponent) {
    componentCls = componentCls.WrappedComponent;
  }

  if (!(componentCls && typeof componentCls.propTypes === 'object')) {
    throw new Error('must pass a React component class as 2nd arg');
  }

  return pick(props, Object.keys(componentCls.propTypes));
}
export function sortDirectionFromSocial(direction) {
  if (direction.toLowerCase() === 'desc') {
    return 'descending';
  }

  return 'ascending';
}
export function sortDirectionToSocial(direction) {
  if (direction === 'descending') {
    return 'desc';
  }

  return 'asc';
}
export function parseBoolean(boolStr) {
  if (typeof boolStr === 'boolean') {
    return boolStr;
  }

  if (boolStr === 'true') {
    return true;
  } else if (boolStr === 'false') {
    return false;
  }

  return undefined;
}
export function parseInteger(intStr) {
  return intStr && parseInt(intStr, 10);
}
/*
 * Derived from this Post Stat Matrix:
 * https://docs.google.com/spreadsheets/d/1P2q8TFyTklYRiQv5qhdPzajtAgc5jBnnuqPLwwnmO9Q/edit#gid=0
 *
 * Note: currently unordered, but we will likely order these soon, and provide additional data such
 * as N/A visibility (vs hidden), drilldown available, etc.
 *
 * Note also: do not add functionality to supportedStatsForPost that relies on async-fetched
 * data being populated on the post object. This is a memoized function, so it will only run once
 * per post keyString.
 */

export var supportedStatsForPost = memoize(function (post) {
  var broadcastGuid = post.get('broadcastGuid');
  var channelSlug = post.get('channelSlug');
  var mediaType = post.get('mediaType');
  var supportedStats = [];

  switch (channelSlug) {
    case CHANNEL_TYPES.linkedincompanypage:
      supportedStats = [POST_STAT_TYPES.clicksNetwork, POST_STAT_TYPES.comments, POST_STAT_TYPES.impressions, POST_STAT_TYPES.interactions, POST_STAT_TYPES.likes, POST_STAT_TYPES.shares];

      if (mediaType === BROADCAST_MEDIA_TYPE.VIDEO) {
        supportedStats = [POST_STAT_TYPES.clicksNetwork, POST_STAT_TYPES.comments, POST_STAT_TYPES.impressions, POST_STAT_TYPES.interactions, POST_STAT_TYPES.likes, POST_STAT_TYPES.shares, POST_STAT_TYPES.videoMinutesWatched, POST_STAT_TYPES.videoViews];
      }

      break;

    case CHANNEL_TYPES.linkedinstatus:
      supportedStats = [POST_STAT_TYPES.comments, POST_STAT_TYPES.interactions, POST_STAT_TYPES.likes];
      break;

    case CHANNEL_TYPES.instagram:
      supportedStats = [POST_STAT_TYPES.comments, POST_STAT_TYPES.impressions, POST_STAT_TYPES.interactions, POST_STAT_TYPES.likes, POST_STAT_TYPES.saves];

      if (mediaType === BROADCAST_MEDIA_TYPE.VIDEO) {
        supportedStats = [].concat(_toConsumableArray(supportedStats), [POST_STAT_TYPES.replies, POST_STAT_TYPES.videoViews]);
      }

      break;

    case CHANNEL_TYPES.twitter:
      supportedStats = [POST_STAT_TYPES.interactions, POST_STAT_TYPES.likes, POST_STAT_TYPES.replies, POST_STAT_TYPES.shares];
      break;

    case CHANNEL_TYPES.youtube:
      supportedStats = [POST_STAT_TYPES.comments, POST_STAT_TYPES.dislikes, POST_STAT_TYPES.interactions, POST_STAT_TYPES.likes, POST_STAT_TYPES.replies, POST_STAT_TYPES.shares, POST_STAT_TYPES.videoAverageViewDurationSeconds, POST_STAT_TYPES.videoAverageViewPercentage, POST_STAT_TYPES.videoMinutesWatched, POST_STAT_TYPES.videoViews, POST_STAT_TYPES.videoViewsPaid];
      break;

    case CHANNEL_TYPES.facebookpage:
      supportedStats = [POST_STAT_TYPES.clicksNetwork, POST_STAT_TYPES.comments, POST_STAT_TYPES.impressions, POST_STAT_TYPES.impressionsPaid, POST_STAT_TYPES.interactions, POST_STAT_TYPES.reactions, POST_STAT_TYPES.reactionsByType, POST_STAT_TYPES.shares];

      if (mediaType === BROADCAST_MEDIA_TYPE.VIDEO) {
        supportedStats = [].concat(_toConsumableArray(supportedStats), [POST_STAT_TYPES.videoAverageViewDurationSeconds, POST_STAT_TYPES.videoAverageViewPercentage, POST_STAT_TYPES.videoMinutesWatched, POST_STAT_TYPES.videoViews, POST_STAT_TYPES.videoViewsPaid]);
      }

      break;

    default:
      break;
  }

  if (broadcastGuid && CLICK_TRACKING_CHANNEL_TYPES.includes(channelSlug)) {
    supportedStats = [].concat(_toConsumableArray(supportedStats), [POST_STAT_TYPES.clicks]);
  }

  return supportedStats;
}, function (p) {
  return p.hashCode();
});
export function isNumeric(thing) {
  return !isNaN(parseFloat(thing)) && isFinite(thing);
}
export function postStatSupported(post, stat) {
  return supportedStatsForPost(post).includes(stat);
}
export var getPublishedFromLanguage = function getPublishedFromLanguage(post) {
  return post.get('broadcastGuid') ? 'sui.manageDashboard.filters.source.internal' : 'sui.manageDashboard.filters.source.external';
};
export function postStatDisplay(post, statKey, statValue) {
  if (postStatSupported(post, statKey)) {
    if (isNumeric(statValue)) {
      return I18n.formatNumber(statValue);
    }

    return STAT_PLACEHOLDERS.supported;
  }

  return STAT_PLACEHOLDERS.notSupported;
}
/* eslint-disable no-console */

export function logError(err, extra) {
  if (console.error && err instanceof Error) {
    console.error(err, extra);
    Raven.captureException(err, {
      extra: extra
    });
  } else {
    console.log(err, extra);
    Raven.captureMessage(err, {
      extra: extra
    });
  }
}
/* eslint-enable no-console */

export function logBreadcrumb(message) {
  var consoleLog = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  Raven.captureBreadcrumb({
    type: 'message',
    message: message
  });

  if (consoleLog) {
    // eslint-disable-next-line no-console
    console.log(message);
  }
}
export function logDebug() {
  if (enviro.debug('social')) {
    var _console;

    // eslint-disable-next-line no-console
    (_console = console).log.apply(_console, arguments);
  }
}
export function elementTopAndBottomIsInViewport(el) {
  if (!el) {
    return false;
  }

  var rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
}
export function formatDuration(secondsVal) {
  var durationUnit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'seconds';

  // seems our needs here are more specific that reporting framework of I18n formatting supports at this time
  if (durationUnit === 'minutes') {
    secondsVal = secondsVal * 60;
  }

  if (secondsVal > 60 * 60) {
    var hours = Math.floor(secondsVal / 60 / 60);
    return I18n.text('srui.chart.timeDisplay.hoursValue', {
      count: hours
    });
  } else {
    var minStr = Math.floor(secondsVal / 60);
    var secStr = I18n.formatNumber(Math.floor(secondsVal) % 60, 2);

    if (secStr.length === 1) {
      secStr = "0" + secStr;
    }

    return I18n.text('srui.chart.timeDisplay.secondsValue', {
      minStr: minStr,
      secStr: secStr
    });
  }
}
var CUSTOM_FILTERS_PATH = ['config', 'filters', 'custom']; // we remove specific channel filtering from report configs before save, as there is not channel filter on Dashboard

var REMOVE_FILTERS_BEFORE_SAVE = ['filters', 'channelKeys', 'channelId'];
export function tweakReportConfigForSave(report) {
  // todo - maybe try to preserve network filter ?  keep campaignGuid?
  var customFilters = report.getIn(CUSTOM_FILTERS_PATH);

  if (customFilters && !customFilters.isEmpty()) {
    customFilters = customFilters.filter(function (f) {
      return !REMOVE_FILTERS_BEFORE_SAVE.includes(f.get('property'));
    });
    report = report.setIn(CUSTOM_FILTERS_PATH, customFilters);
  }

  report = report.deleteIn(['displayParams', 'showDelta']);
  return report;
}
export function uppercaseFirstLetter(text) {
  if (text) {
    text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  return text;
}
export function smartAdd(attrs, element) {
  if (attrs.indexOf(element) === -1) {
    attrs.push(element);
  }

  return attrs;
}
export function smartDelete(attrs, element) {
  if (attrs.indexOf(element) !== -1) {
    attrs.splice(attrs.indexOf(element), 1);
  }

  return attrs;
}
export function getExtensionFromString(url) {
  return url.split(/#|\?/)[0].split('.').pop().trim().toLowerCase();
}
export var getNetworksArrayFromChannels = function getNetworksArrayFromChannels(channels) {
  var result = channels.reduce(function (accumulator, channel) {
    if (accumulator.indexOf(channel.accountSlug) === -1 && !channel.accountExpired) {
      return [].concat(_toConsumableArray(accumulator), [channel.accountSlug]);
    }

    return accumulator;
  }, []);
  return result;
};
export var extractPreviewLinkFromBroadcast = function extractPreviewLinkFromBroadcast(broadcast) {
  var content = broadcast.content;
  var originalLink = content.get('originalLink');
  var uncompressedLinks = content.get('uncompressedLinks');
  var firstLink = uncompressedLinks ? uncompressedLinks.first() : undefined;
  return originalLink || firstLink;
};
/**
 * Gets the right props for the UIStatusTag component,
 * corresponding to BROADCAST_STATUS_TYPE constants
 *
 * @param {object} params            Object of parameters
 * @param {string} params.statusType A constant from BROADCAST_STATUS_TYPE
 * @param {string} params.testId     A test ID to be passed to the return object
 *
 * @returns {object}  returnObj      The return object
 */

export var getBroadcastStatusTypePropsWithTestId = function getBroadcastStatusTypePropsWithTestId(_ref3) {
  var statusType = _ref3.statusType,
      testId = _ref3.testId;
  return Object.assign({}, BROADCAST_STATUS_TYPE_TO_STATUS_TAG_PROPS[statusType], {
    'data-test-id': testId
  });
};