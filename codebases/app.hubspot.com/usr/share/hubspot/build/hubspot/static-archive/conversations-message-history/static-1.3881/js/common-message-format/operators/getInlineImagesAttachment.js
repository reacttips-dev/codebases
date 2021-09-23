'use es6';

import { getAttachments } from './getAttachments';
import { INLINE_IMAGES } from '../constants/attachmentTypes';
import get from 'transmute/get';
import { List } from 'immutable';
export var getInlineImagesAttachment = function getInlineImagesAttachment(message) {
  var attachments = getAttachments(message);

  if (attachments) {
    var fileAttachment = attachments.find(function (attachment) {
      return get('@type', attachment) === INLINE_IMAGES;
    });
    return fileAttachment && fileAttachment.size >= 1 ? fileAttachment : List();
  }

  return List();
};