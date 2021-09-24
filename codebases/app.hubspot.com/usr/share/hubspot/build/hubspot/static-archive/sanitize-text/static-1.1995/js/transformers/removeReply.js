'use es6';

import { secureDocument } from '../sanitizers/SanitizeConfiguration';
export var GMAIL_QUOTE = 'gmail_quote';
export var REPLY_CLASSLIST = [// Gmail
'gmail_extra', GMAIL_QUOTE, // HubSpot
'hs_reply', 'x_hs_reply_wrap'];
export var OFFICE_365_REPLY_ID = 'divRplyFwdMsg';
/**
 *
 * All Gmail email bodies are wrapped in a div that specifies the direction (dir) of the text
 * in the email like so:
 *
 * @example
 * <div dir="ltr">
 *
 * Thus, a formatted quote in a Gmail email is wrapped in such a div (we want to leave these in tact)
 *
 * @example
 * <div dir="ltr">
 *   <blockquote class="gmail_quote"> my quote </blockquote>
 * </div>
 *
 * However, Gmail replies are wrapped the other way around (we want to remove these replies)
 *
 * @example
 * <blockquote class="gmail_quote">
 *   <div dir="ltr"> my reply </div>
 * </blockquote>
 *
 * @description
 * Thus, if a blockquote has a child <div dir="ltr">, we can assume that it is
 * a reply that we want to remove. Otherwise, it is a formatted quote that we
 * want to leave in tact.
 *
 */

export var isGmailReplyBlockquote = function isGmailReplyBlockquote(node) {
  return node.querySelector('div[dir]');
};

var isReply = function isReply(classList, id) {
  return id === OFFICE_365_REPLY_ID || classList && classList.contains && REPLY_CLASSLIST.some(function (className) {
    return classList.contains(className);
  });
};

export var removeReply = function removeReply(_ref) {
  var node = _ref.node;
  var classList = node.classList,
      id = node.id,
      _node$attributes = node.attributes,
      attributes = _node$attributes === void 0 ? [] : _node$attributes;

  if (isReply(classList, id)) {
    if (classList.contains(GMAIL_QUOTE) && !isGmailReplyBlockquote(node)) {
      return null;
    }

    var span = secureDocument.createElement('span');
    Object.keys(attributes).forEach(function (key) {
      var attribute = attributes[key];
      span.setAttribute(attribute.nodeName, attribute.nodeValue);
    });
    span.innerHTML = '';
    span.setAttribute('data-email-reply', '');
    return {
      node: span
    };
  }

  return null;
};