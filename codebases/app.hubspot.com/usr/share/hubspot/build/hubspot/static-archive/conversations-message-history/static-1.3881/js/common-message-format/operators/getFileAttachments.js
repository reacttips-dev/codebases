'use es6';

import get from 'transmute/get';
import { List } from 'immutable';
import { FILES } from '../constants/attachmentTypes';
import { getAttachments } from './getAttachments';
export var getFileAttachments = function getFileAttachments(commonMessage) {
  var attachments = getAttachments(commonMessage);

  if (attachments) {
    var fileAttachment = attachments.find(function (attachmentObject) {
      return get('@type', attachmentObject) === FILES;
    });
    return fileAttachment;
  } else {
    return List();
  }
};