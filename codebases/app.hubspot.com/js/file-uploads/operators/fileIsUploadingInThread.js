'use es6';

import getIn from 'transmute/getIn';
export var fileIsUploadingInThread = function fileIsUploadingInThread(_ref, state) {
  var localId = _ref.localId,
      threadId = _ref.threadId;
  return Boolean(getIn([threadId, localId], state));
};