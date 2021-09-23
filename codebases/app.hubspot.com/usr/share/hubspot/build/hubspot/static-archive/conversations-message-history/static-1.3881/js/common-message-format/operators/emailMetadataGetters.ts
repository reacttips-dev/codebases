import getIn from 'transmute/getIn';
import pipe from 'transmute/pipe';
import { BCC, CC, CLIP_STATUS, CONNECTED_ACCOUNT_ADDRESS, FROM, FROM_EMAIL, FROM_NAME, HAS_REPLIES, PREVIOUS_REPLIES_HTML, PREVIOUS_REPLIES_PLAIN_TEXT, SUBJECT, TO, ORIGINAL_SENDER_EMAIL, ORIGINAL_SENDER_NAME, MEMBER_OF_FORWARDED_SUBTHREAD, IS_FORWARD } from '../constants/emailMetadataKeypaths';
import { getEmailMetadata } from './getEmailMetadata';
export var getMetadataSubject = getIn(SUBJECT);
export var getSubject = pipe(getEmailMetadata, getMetadataSubject);
export var getMetadataFrom = getIn(FROM);
export var getFrom = pipe(getEmailMetadata, getMetadataFrom);
export var getMetadataFromAddress = getIn(FROM_EMAIL);
export var getFromAddress = pipe(getEmailMetadata, getMetadataFromAddress);
export var getMetadataFromName = getIn(FROM_NAME);
export var getFromName = pipe(getEmailMetadata, getMetadataFromName);
export var getMetadataToAddresses = function getMetadataToAddresses(metadata) {
  var result = getIn(TO, metadata);
  return result ? result.map(function (email) {
    if (email) {
      return email.trim();
    }

    return email;
  }) : result;
};
export var getToAddresses = pipe(getEmailMetadata, getMetadataToAddresses);
export var getMetadataBCC = getIn(BCC);
export var getBCC = pipe(getEmailMetadata, getMetadataBCC);
export var getMetadataCC = getIn(CC);
export var getCC = pipe(getEmailMetadata, getMetadataCC);
export var getMetadataOriginalSenderEmail = getIn(ORIGINAL_SENDER_EMAIL);
export var getOriginalSenderEmail = pipe(getEmailMetadata, getMetadataOriginalSenderEmail);
export var getMetadataOriginalSenderName = getIn(ORIGINAL_SENDER_NAME);
export var getOriginalSenderName = pipe(getEmailMetadata, getMetadataOriginalSenderName);
export var getMetadataConnectedAccountAddress = getIn(CONNECTED_ACCOUNT_ADDRESS);
export var getConnectedAccountAddress = pipe(getEmailMetadata, getMetadataConnectedAccountAddress);
export var getMetadataHasReplies = getIn(HAS_REPLIES);
export var getHasReplies = pipe(getEmailMetadata, getMetadataHasReplies);
export var getMetadataPreviousRepliesHtml = getIn(PREVIOUS_REPLIES_HTML);
export var getPreviousRepliesHtml = pipe(getEmailMetadata, getMetadataPreviousRepliesHtml);
export var getMetadataPreviousRepliesPlainText = getIn(PREVIOUS_REPLIES_PLAIN_TEXT);
export var getPreviousRepliesPlainText = pipe(getEmailMetadata, getMetadataPreviousRepliesPlainText);
export var getMetadataIsMemberOfForwardedSubthread = getIn(MEMBER_OF_FORWARDED_SUBTHREAD);
export var getIsMemberOfForwardedSubthread = pipe(getEmailMetadata, getMetadataIsMemberOfForwardedSubthread);
export var getMetadataIsForward = getIn(IS_FORWARD);
export var getIsForward = pipe(getEmailMetadata, getMetadataIsForward);
export var getMetadataClipStatus = getIn(CLIP_STATUS);
export var getClipStatus = pipe(getEmailMetadata, getMetadataClipStatus);