'use es6';

import { Record } from 'immutable';
var ThreadPreviewRecord = Record({
  hasFileAttachment: false,
  previewText: null,
  failed: false,
  responder: null,
  visitor: null
}, 'ThreadPreviewRecord');
export default ThreadPreviewRecord;