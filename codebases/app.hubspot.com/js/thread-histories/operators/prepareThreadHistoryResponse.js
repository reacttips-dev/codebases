'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { buildResolvedAttachmentsMapFromResponse } from '../../resolved-attachments/operators/buildResolvedAttachmentsMapFromResponse';
import { buildThreadHistoryFromResponse } from './buildThreadHistoryFromResponse';
export var prepareThreadHistoryResponse = function prepareThreadHistoryResponse(_ref) {
  var attachments = _ref.attachments,
      hasVisitorEmail = _ref.hasVisitorEmail,
      threadHistory = _objectWithoutProperties(_ref, ["attachments", "hasVisitorEmail"]);

  return {
    files: buildResolvedAttachmentsMapFromResponse(attachments.files),
    threadHistory: buildThreadHistoryFromResponse(threadHistory),
    hasVisitorEmail: hasVisitorEmail
  };
};