'use es6';

import get from 'transmute/get';
import { QUICK_REPLIES } from '../constants/attachmentTypes';
import { getAttachments } from './getAttachments';
import { getAllowMultiSelect as getAllowMultiSelectFromQuickReply, getAllowUserInput as getAllowUserInputFromQuickReply, getQuickReplies as getQuickRepliesFromQuickReply } from './quickReplyAttachmentGetters';
export var getQuickReplyAttachment = function getQuickReplyAttachment(commonMessage) {
  var attachments = getAttachments(commonMessage);

  if (!attachments) {
    return undefined;
  }

  var quickReplyAttachment = attachments.find(function (attachmentObject) {
    return get('@type', attachmentObject) === QUICK_REPLIES;
  });
  return quickReplyAttachment;
};
export var getQuickReply = function getQuickReply(message) {
  return getQuickReplyAttachment(message);
};
export var getQuickReplyAllowMultiSelect = function getQuickReplyAllowMultiSelect(message) {
  var quickReplyAttachment = getQuickReplyAttachment(message);
  return getAllowMultiSelectFromQuickReply(quickReplyAttachment);
};
export var getQuickReplyAllowUserInput = function getQuickReplyAllowUserInput(message) {
  var quickReplyAttachment = getQuickReplyAttachment(message);
  return getAllowUserInputFromQuickReply(quickReplyAttachment);
};
export var getQuickReplyReplies = function getQuickReplyReplies(message) {
  var quickReplyAttachment = getQuickReplyAttachment(message);
  return getQuickRepliesFromQuickReply(quickReplyAttachment);
};