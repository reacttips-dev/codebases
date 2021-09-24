'use es6';

import { getEntry } from 'conversations-async-data/indexed-async-data/operators/getters';
import { defaultMemoize } from 'reselect';
import { buildResponderKey } from './buildResponderKey';
export var getResponderByIdAndType = defaultMemoize(function (_ref) {
  var responders = _ref.responders,
      senderId = _ref.senderId,
      senderType = _ref.senderType;

  if (!senderId || !senderType) {
    return null;
  }

  var key = buildResponderKey({
    senderId: senderId,
    senderType: senderType
  });
  return getEntry(key, responders);
});