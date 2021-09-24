import get from 'transmute/get';
import { EMAIL_METADATA } from '../constants/attachmentTypes';
import { getAttachments } from './getAttachments';
export var getEmailMetadata = function getEmailMetadata(commonMessage) {
  var attachments = getAttachments(commonMessage);

  if (attachments) {
    return attachments.find(function (attachmentObject) {
      return Boolean(attachmentObject && get('@type', attachmentObject) === EMAIL_METADATA);
    });
  }

  return undefined;
};