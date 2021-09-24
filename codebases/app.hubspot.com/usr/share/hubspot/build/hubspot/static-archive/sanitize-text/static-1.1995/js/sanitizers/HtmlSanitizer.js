'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { config } from './SanitizeConfiguration';
import memoize from 'transmute/memoize';
import Autolinker from './Autolinker';
import { sanitize } from './Sanitize';
import { fixImages } from '../transformers/fixImages';
import { removeOutlookLineBreaks } from '../transformers/removeOutlookLineBreaks';
import { removeReply, REPLY_CLASSLIST, OFFICE_365_REPLY_ID } from '../transformers/removeReply';
import { replaceGmailDivs } from '../transformers/replaceGmailDivs';
import { removeGmailLineBreakBeforeReply } from '../transformers/removeGmailLineBreakBeforeReply';
import { openLinksInNewTab } from '../transformers/openLinksInNewTab';
import { removeEmailSignature, SIGNATURE_CLASSLIST, GMAIL_SIGNATURE } from '../transformers/removeEmailSignature';
import { allowlistIframes } from '../transformers/allowlistIframes';
import { getTextContentFromHtml as TextSanitizer_getTextContentFromHtml } from './TextSanitizer';
export var hasReplyOrSignature = memoize(function (body) {
  return !![].concat(_toConsumableArray(REPLY_CLASSLIST), [OFFICE_365_REPLY_ID], _toConsumableArray(SIGNATURE_CLASSLIST), [GMAIL_SIGNATURE]).find(function (replyIdentifier) {
    return body.includes(replyIdentifier);
  });
}); // Continue to export `getTextContentFromHtml` from `HtmlSanitizer` for backwards-compatibility,
// until all usages are updated to import from `TextSanitizer`.
// See https://git.hubteam.com/HubSpot/CRM-Issues/issues/8699

export var getTextContentFromHtml = TextSanitizer_getTextContentFromHtml;
export var formatThreadedEmailPreview = memoize(function (text) {
  var charLimit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 400;
  var transformers = [removeOutlookLineBreaks, replaceGmailDivs, removeReply];
  var formattedText = sanitize(text, config.TEXTONLY, transformers);
  return formattedText && formattedText.length > charLimit ? formattedText.substring(0, charLimit) : formattedText;
});
var cleanHtmlWithoutEmailReplies = memoize(function (_ref) {
  var text = _ref.text,
      _ref$shouldRemoveGmai = _ref.shouldRemoveGmailLineBreakBeforeReply,
      shouldRemoveGmailLineBreakBeforeReply = _ref$shouldRemoveGmai === void 0 ? false : _ref$shouldRemoveGmai,
      _ref$shouldRemoveEmai = _ref.shouldRemoveEmailSignature,
      shouldRemoveEmailSignature = _ref$shouldRemoveEmai === void 0 ? true : _ref$shouldRemoveEmai,
      _ref$htmlConfig = _ref.htmlConfig,
      htmlConfig = _ref$htmlConfig === void 0 ? config.HTML : _ref$htmlConfig,
      _ref$shouldOpenLinksI = _ref.shouldOpenLinksInNewTab,
      shouldOpenLinksInNewTab = _ref$shouldOpenLinksI === void 0 ? false : _ref$shouldOpenLinksI,
      _ref$allowedDomainsFo = _ref.allowedDomainsForIframe,
      allowedDomainsForIframe = _ref$allowedDomainsFo === void 0 ? [] : _ref$allowedDomainsFo;
  var optionalTransformers = [].concat(_toConsumableArray(shouldRemoveGmailLineBreakBeforeReply ? [removeGmailLineBreakBeforeReply] : []), _toConsumableArray(shouldRemoveEmailSignature ? [removeEmailSignature] : []), _toConsumableArray(shouldOpenLinksInNewTab ? [openLinksInNewTab] : []));
  var transformers = [removeOutlookLineBreaks, replaceGmailDivs, removeReply, fixImages, function (args) {
    return allowlistIframes(Object.assign({}, args, {
      allowedDomainsForIframe: allowedDomainsForIframe
    }));
  }].concat(_toConsumableArray(optionalTransformers));
  return sanitize(text, htmlConfig, transformers);
});
var cleanHtmlWithEmailReplies = memoize(function (_ref2) {
  var text = _ref2.text,
      _ref2$shouldRemoveGma = _ref2.shouldRemoveGmailLineBreakBeforeReply,
      shouldRemoveGmailLineBreakBeforeReply = _ref2$shouldRemoveGma === void 0 ? false : _ref2$shouldRemoveGma,
      _ref2$shouldRemoveEma = _ref2.shouldRemoveEmailSignature,
      shouldRemoveEmailSignature = _ref2$shouldRemoveEma === void 0 ? false : _ref2$shouldRemoveEma,
      _ref2$htmlConfig = _ref2.htmlConfig,
      htmlConfig = _ref2$htmlConfig === void 0 ? config.HTML : _ref2$htmlConfig,
      _ref2$shouldOpenLinks = _ref2.shouldOpenLinksInNewTab,
      shouldOpenLinksInNewTab = _ref2$shouldOpenLinks === void 0 ? false : _ref2$shouldOpenLinks,
      _ref2$allowedDomainsF = _ref2.allowedDomainsForIframe,
      allowedDomainsForIframe = _ref2$allowedDomainsF === void 0 ? [] : _ref2$allowedDomainsF;
  var optionalTransformers = [].concat(_toConsumableArray(shouldRemoveGmailLineBreakBeforeReply ? [removeGmailLineBreakBeforeReply] : []), _toConsumableArray(shouldRemoveEmailSignature ? [removeEmailSignature] : []), _toConsumableArray(shouldOpenLinksInNewTab ? [openLinksInNewTab] : []));
  var transformers = [removeOutlookLineBreaks, replaceGmailDivs, fixImages, function (args) {
    return allowlistIframes(Object.assign({}, args, {
      allowedDomainsForIframe: allowedDomainsForIframe
    }));
  }].concat(_toConsumableArray(optionalTransformers));
  return sanitize(text, htmlConfig, transformers);
});
export var escapeBrackets = function escapeBrackets(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};
export var formatHtml = function formatHtml(body) {
  var formattingOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var shouldAutolinkTwitter = formattingOptions.shouldAutolinkTwitter,
      shouldIncludeReplies = formattingOptions.shouldIncludeReplies,
      shouldRemoveGmailLineBreakBeforeReply = formattingOptions.shouldRemoveGmailLineBreakBeforeReply,
      shouldRemoveEmailSignature = formattingOptions.shouldRemoveEmailSignature,
      isPlainText = formattingOptions.isPlainText,
      shouldPreserveNewlines = formattingOptions.shouldPreserveNewlines,
      allowedDomainsForIframe = formattingOptions.allowedDomainsForIframe,
      shouldOpenLinksInNewTab = formattingOptions.shouldOpenLinksInNewTab;

  if (!body) {
    return '';
  }

  var htmlConfig = config.HTML;

  if (allowedDomainsForIframe) {
    htmlConfig.elements.push('iframe');
    htmlConfig.attributes.iframe = ['style', 'src', 'scrolling', 'frameborder', 'allowtransparency', 'allowfullscreen'];
  }

  var bodyToFormat = isPlainText ? escapeBrackets(body) : body;
  var formattedBody = shouldIncludeReplies ? cleanHtmlWithEmailReplies({
    text: bodyToFormat,
    shouldRemoveGmailLineBreakBeforeReply: shouldRemoveGmailLineBreakBeforeReply,
    shouldRemoveEmailSignature: shouldRemoveEmailSignature,
    shouldOpenLinksInNewTab: shouldOpenLinksInNewTab,
    htmlConfig: htmlConfig,
    allowedDomainsForIframe: allowedDomainsForIframe
  }) : cleanHtmlWithoutEmailReplies({
    text: bodyToFormat,
    shouldRemoveEmailSignature: shouldRemoveEmailSignature,
    shouldRemoveGmailLineBreakBeforeReply: shouldRemoveGmailLineBreakBeforeReply,
    shouldOpenLinksInNewTab: shouldOpenLinksInNewTab,
    htmlConfig: htmlConfig,
    allowedDomainsForIframe: allowedDomainsForIframe
  });
  formattedBody = isPlainText || shouldPreserveNewlines ? formattedBody : formattedBody.replace('\n', '');
  var autolinker = shouldAutolinkTwitter ? Autolinker.getTwitter() : Autolinker.get();
  return autolinker.link(formattedBody);
};
export { OFFICE_365_REPLY_ID };
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}