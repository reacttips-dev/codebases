'use es6';

import deprecateFunction from '../../util/deprecateFunction';
import getIn from 'transmute/getIn';
import pipe from 'transmute/pipe';
import { SYSTEM_SENDER } from '../constants/cmfSenderTypes';
import { AUDIT_PARAMS, CLIENT_TYPE, CONTENT_TYPE, ERROR_MESSAGE, HAS_MORE, HAS_STRIPPED_INLINE_IMAGES, ID, IN_REPLY_TO_ID, LOCALIZED_ERROR_KEY, MESSAGE_DELETE_STATUS, MESSAGE_ID, MESSAGE_SEND_FAILURE, MESSAGE_STATUS, MESSAGE_STATUS_SOURCE, MESSAGE_STATUS_TIMESTAMP, RICH_TEXT, SENDER, SENDER_TYPE, STRIPPED_ATTACHMENT_COUNT, TEXT, TIMESTAMP, TYPE } from '../constants/keyPaths';
import { fromCmfSender } from './cmfSenderInterop';
import * as CmfEmailMetadataGetters from './emailMetadataGetters';
import { getFileIds as getFileIdsFromAttachments } from './fileAttachmentGetters';
import { getFileAttachments } from './getFileAttachments';
import { getSenderKeyFromType } from './getSenderKeyFromType';
import { getInlineImagesAttachment } from './getInlineImagesAttachment';
import { getEmailMetadata } from './getEmailMetadata';
export var getClientType = getIn(CLIENT_TYPE);
export var getId = getIn(ID);
export var getContentType = getIn(CONTENT_TYPE);
export var getPlainTextForCmf = getIn(TEXT);
export var getRichTextForCmf = getIn(RICH_TEXT);
export var getStatusForCmf = getIn(MESSAGE_STATUS);
export var getStatusSource = getIn(MESSAGE_STATUS_SOURCE);
export var getStatusTimestamp = getIn(MESSAGE_STATUS_TIMESTAMP);
export var getMessageIdForCmf = getIn(MESSAGE_ID);
export var getHasMore = getIn(HAS_MORE);
export var getAuditForCmf = getIn(AUDIT_PARAMS);
export var getStrippedAttachmentCount = getIn(STRIPPED_ATTACHMENT_COUNT);
export var getHasInlineImagesStripped = getIn(HAS_STRIPPED_INLINE_IMAGES);
export var getFileIds = pipe(getFileAttachments, getFileIdsFromAttachments);
export var getAttachmentStrippedCount = pipe(getFileAttachments, getStrippedAttachmentCount);
export var hasInlineImagesStripped = pipe(getInlineImagesAttachment, getHasInlineImagesStripped);
export var getTopLevelType = getIn(TYPE);
export var getInReplyToId = getIn(IN_REPLY_TO_ID);
var getTimestampForCMF = getIn(TIMESTAMP);
export var getSenderTypeForCMF = getIn(SENDER_TYPE);
var getMessageDeleteStatusForCmf = getIn(MESSAGE_DELETE_STATUS);
export var getMessageSendFailure = getIn(MESSAGE_SEND_FAILURE);
export var getSender = getIn(SENDER);
export var getSenderKey = function getSenderKey(message) {
  var type = getSenderTypeForCMF(message);
  return getSenderKeyFromType(type);
};

var getSenderIdForCMF = function getSenderIdForCMF(message) {
  if (getSenderTypeForCMF(message) === SYSTEM_SENDER) {
    return null;
  }

  return getIn(['sender', getSenderKey(message)], message);
};

export var getSenderType = function getSenderType(message) {
  return fromCmfSender(getSenderTypeForCMF(message));
};
export var getHasMetadata = function getHasMetadata(message) {
  return !!getEmailMetadata(message);
};
export var getSubject = function getSubject(message) {
  return CmfEmailMetadataGetters.getSubject(message);
};
export var getFromAddress = function getFromAddress(message) {
  return CmfEmailMetadataGetters.getFromAddress(message);
};
export var getOriginalSenderEmail = function getOriginalSenderEmail(message) {
  return CmfEmailMetadataGetters.getOriginalSenderEmail(message);
};
export var getOriginalSenderName = function getOriginalSenderName(message) {
  return CmfEmailMetadataGetters.getOriginalSenderName(message);
};
export var getFromName = function getFromName(message) {
  return CmfEmailMetadataGetters.getFromName(message);
}; // TODO: Remove references to this operator. It's misleading

export var getAttachments = deprecateFunction('Use fileAttachmentGetters instead.', function (message) {
  return getFileIds(message);
});
export var getToAddresses = function getToAddresses(message) {
  return CmfEmailMetadataGetters.getToAddresses(message);
};
export var getBCC = function getBCC(message) {
  return CmfEmailMetadataGetters.getBCC(message);
};
export var getCC = function getCC(message) {
  return CmfEmailMetadataGetters.getCC(message);
};
export var getConnectedAccountAddress = function getConnectedAccountAddress(message) {
  return CmfEmailMetadataGetters.getConnectedAccountAddress(message);
};
export var getHasReplies = function getHasReplies(message) {
  return CmfEmailMetadataGetters.getHasReplies(message);
};
export var getPreviousRepliesHtml = function getPreviousRepliesHtml(message) {
  return CmfEmailMetadataGetters.getPreviousRepliesHtml(message);
};
export var getPreviousRepliesPlainText = function getPreviousRepliesPlainText(message) {
  return CmfEmailMetadataGetters.getPreviousRepliesPlainText(message);
};
export var getIsMemberOfForwardedSubthread = function getIsMemberOfForwardedSubthread(message) {
  return CmfEmailMetadataGetters.getIsMemberOfForwardedSubthread(message);
};
export var getIsForward = function getIsForward(message) {
  return CmfEmailMetadataGetters.getIsForward(message);
};
export var getLocalizedErrorKey = getIn(LOCALIZED_ERROR_KEY);
export var getErrorMessage = getIn(ERROR_MESSAGE);
export { getAuditForCmf as getAudit, getMessageDeleteStatusForCmf as getMessageDeleteStatus, getMessageIdForCmf as getEmailMessageId, getPlainTextForCmf as getPlainText, getRichTextForCmf as getRichText, getSenderIdForCMF as getSenderId, getStatusForCmf as getStatus, getTimestampForCMF as getTimestamp, getTopLevelType as getType };