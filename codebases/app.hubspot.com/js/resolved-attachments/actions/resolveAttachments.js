'use es6';

import { createDeprecatedAsyncAction } from 'conversations-async-data/async-action/createDeprecatedAsyncAction';
import { resolveAttachmentsClient } from '../clients/resolveAttachmentsClient';
import { RESOLVE_ATTACHMENTS } from '../constants/resolvedAttachmentsActionTypes';
import { buildResolvedAttachmentsMapFromResponse } from '../operators/buildResolvedAttachmentsMapFromResponse';
export var resolveAttachments = createDeprecatedAsyncAction({
  requestFn: resolveAttachmentsClient,
  actionTypes: RESOLVE_ATTACHMENTS,
  toRecordFn: buildResolvedAttachmentsMapFromResponse
});