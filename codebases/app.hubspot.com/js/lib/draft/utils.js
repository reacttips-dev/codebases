'use es6';

import { escape } from 'underscore';
import { ACCOUNT_TYPES, FACEBOOK_MENTION_PATTERN, LINKEDIN_MENTION_PATTERN } from '../constants';
import TwitterText from 'twitter-text'; // must undo escaping draft-covert does here until we have a better workaround https://github.com/HubSpot/draft-convert/blob/master/src/encodeBlock.js#L4-L12

var UNESCAPE_ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#x27;': "'",
  '&#x60;': '`'
}; // for now, we must prepare out plaintext message body for draft-cover's convertToHTML process

export var preProcessText = function preProcessText(text) {
  var singleBlock = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (singleBlock) {
    return "<p>" + escape(text).replace(/\n/g, '<br />') + "</p>";
  }

  return text.split('\n').map(function (line) {
    return "<p>" + escape(line) + "</p>";
  }).join('\n');
}; // and also deal with how it escapes entities and adds an extra newline

export var postProcessText = function postProcessText(text) {
  text = text.replace(/<br\/>/g, '\n');

  if (text.endsWith('\n')) {
    text = text.substr(0, text.length - 1);
  }

  Object.keys(UNESCAPE_ENTITIES).forEach(function (entity) {
    text = text.replace(new RegExp(entity, 'g'), UNESCAPE_ENTITIES[entity]);
  });
  return text;
};
export var prepareForClone = function prepareForClone(message, fromNetwork, toNetwork) {
  if (!message) {
    return '';
  }

  var RAW_MENTION_NETWORKS = [ACCOUNT_TYPES.twitter, ACCOUNT_TYPES.instagram];

  if (RAW_MENTION_NETWORKS.includes(toNetwork) && RAW_MENTION_NETWORKS.includes(fromNetwork)) {
    return message;
  }

  if (RAW_MENTION_NETWORKS.includes(fromNetwork)) {
    var mentions = TwitterText.extractMentions(message);
    mentions.forEach(function (m) {
      message = message.replace("@" + m, m);
    });
  } else if (fromNetwork === ACCOUNT_TYPES.facebook && toNetwork !== ACCOUNT_TYPES.facebook) {
    message = message.replace(FACEBOOK_MENTION_PATTERN, function (match, pageId, name) {
      return name;
    });
  } else if (fromNetwork === ACCOUNT_TYPES.linkedin && toNetwork !== ACCOUNT_TYPES.linkedin) {
    message = message.replace(LINKEDIN_MENTION_PATTERN, function (match, pageId, name) {
      return name;
    });
  }

  return message;
};
var instagramHashtagRegex = new RegExp(/#\w+/gi); // Test via https://regexr.com/4j88i

export var hashtagCountForInstagram = function hashtagCountForInstagram(text) {
  if (text) {
    var result = text.match(instagramHashtagRegex);
    return result && result.length || 0;
  } else {
    return 0;
  }
};