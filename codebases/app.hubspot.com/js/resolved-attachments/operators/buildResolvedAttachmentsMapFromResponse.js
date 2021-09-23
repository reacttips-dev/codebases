'use es6';

import reduce from 'transmute/reduce';
import { Map as ImmutableMap } from 'immutable';
import ResolvedAttachmentRecord from 'conversations-internal-schema/resolved-attachment/records/ResolvedAttachmentRecord';
export var buildResolvedAttachmentsMapFromResponse = function buildResolvedAttachmentsMapFromResponse(response) {
  return reduce(ImmutableMap(), function (resolvedAttachments) {
    var resolvedAttachment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var fileIdKey = arguments.length > 2 ? arguments[2] : undefined;
    var fileId = parseInt(fileIdKey, 10);
    var attachmentRecord = new ResolvedAttachmentRecord(Object.assign({}, resolvedAttachment, {
      fileId: fileId
    }));
    return resolvedAttachments.set(fileId, attachmentRecord);
  }, response);
};