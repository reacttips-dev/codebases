'use es6';

import { List } from 'immutable';
import get from 'transmute/get';
import { FILES } from '../constants/attachmentTypes';
import { getFileIds } from './fileAttachmentGetters';
import { getAttachments } from './getAttachments';
/**
 *
 * @param {CommonMessageRecord} message - common message record
 * @returns {List<number>} list of file attachment ids in message
 *
 */

export var fileAttachmentIdsInMessage = function fileAttachmentIdsInMessage(message) {
  var attachments = getAttachments(message) || List();
  var fileAttachment = attachments.find(function (attachment) {
    return get('@type', attachment) === FILES;
  });

  if (!fileAttachment) {
    return List();
  }

  return getFileIds(fileAttachment);
};