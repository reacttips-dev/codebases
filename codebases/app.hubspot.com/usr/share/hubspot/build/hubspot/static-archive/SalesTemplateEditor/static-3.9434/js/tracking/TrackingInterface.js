'use es6';

import { MergeTagTypes } from 'draft-plugins/lib/mergeTagConstants';
import { INCLUDE_LINK_PREVIEW, INSERTED_DOCUMENT, INSERTED_SNIPPET, INSERTED_SNIPPET_FROM_POPOVER, INSERTED_CONTENT, INSERTED_CONTENT_FROM_POPOVER, INSERTED_CONTACT_TOKEN, INSERTED_COMPANY_TOKEN, INSERTED_DEAL_TOKEN, INSERTED_MEETINGS_LINK, INSERTED_TICKET_TOKEN, INSERTED_SENDER_TOKEN, INSERTED_CUSTOM_TOKEN, VIEWED_SUGGESTIONS, USED_SUGGESTIONS, USED_ALL_SUGGESTIONS, UPDATE_TEMPLATE, VIEW_WRITE_PERMISSION_TOOLTIP } from './Actions';
import { trackInteraction, trackTemplateInteraction } from './tracker';
export var onIncludeLinkPreview = function onIncludeLinkPreview() {
  return trackInteraction(INCLUDE_LINK_PREVIEW);
};
export var onInsertDocument = function onInsertDocument() {
  return trackInteraction(INSERTED_DOCUMENT);
};
export var onInsertSnippet = function onInsertSnippet(_ref) {
  var _ref$fromPopover = _ref.fromPopover,
      fromPopover = _ref$fromPopover === void 0 ? false : _ref$fromPopover;
  return fromPopover ? trackInteraction(INSERTED_SNIPPET_FROM_POPOVER) : trackInteraction(INSERTED_SNIPPET);
};
export var onInsertContent = function onInsertContent(_ref2) {
  var _ref2$fromPopover = _ref2.fromPopover,
      fromPopover = _ref2$fromPopover === void 0 ? false : _ref2$fromPopover;
  return fromPopover ? trackInteraction(INSERTED_CONTENT_FROM_POPOVER) : trackInteraction(INSERTED_CONTENT);
};
export var onInsertToken = function onInsertToken(prefix) {
  switch (prefix) {
    case MergeTagTypes.CONTACT:
      return trackInteraction(INSERTED_CONTACT_TOKEN);

    case MergeTagTypes.COMPANY:
      return trackInteraction(INSERTED_COMPANY_TOKEN);

    case MergeTagTypes.DEAL:
      return trackInteraction(INSERTED_DEAL_TOKEN);

    case MergeTagTypes.TICKET:
      return trackInteraction(INSERTED_TICKET_TOKEN);

    case MergeTagTypes.SENDER:
      return trackInteraction(INSERTED_SENDER_TOKEN);

    case MergeTagTypes.PLACEHOLDER:
      return trackInteraction(INSERTED_CUSTOM_TOKEN);

    default:
      return null;
  }
};
export var onInsertMeetingsLink = function onInsertMeetingsLink() {
  return trackInteraction(INSERTED_MEETINGS_LINK);
};
export var onViewSuggestions = function onViewSuggestions() {
  return trackInteraction(VIEWED_SUGGESTIONS);
};
export var onUseSuggestions = function onUseSuggestions(_ref3) {
  var _ref3$all = _ref3.all,
      all = _ref3$all === void 0 ? false : _ref3$all;
  return all ? trackInteraction(USED_ALL_SUGGESTIONS) : trackInteraction(USED_SUGGESTIONS);
};
export var onUpdateTemplate = function onUpdateTemplate(_ref4) {
  var ownership = _ref4.ownership;
  return trackTemplateInteraction({
    action: UPDATE_TEMPLATE,
    ownership: ownership
  });
};
export var onViewWritePermissionTooltip = function onViewWritePermissionTooltip() {
  return trackTemplateInteraction({
    action: VIEW_WRITE_PERMISSION_TOOLTIP
  });
};
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}