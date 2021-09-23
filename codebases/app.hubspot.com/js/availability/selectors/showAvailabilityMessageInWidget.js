'use es6';

import { createSelector } from 'reselect';
import { hasMessages } from 'conversations-message-history/thread-history/operators/hasMessages';
import { getSelectedThreadId } from '../../selected-thread/selectors/getSelectedThreadId';
import { getIsUnassignedResponderInWidget } from '../../responders/selectors/getIsUnassignedResponderInWidget';
import { historyDataForThread } from '../../thread-histories/selectors/historyDataForThread';
export var showAvailabilityMessageInWidget = createSelector([getSelectedThreadId, getIsUnassignedResponderInWidget, historyDataForThread], function (selectedThreadId, isUnassigned, history) {
  var isInThreadView = selectedThreadId !== null;
  return isInThreadView && isUnassigned && Boolean(history) && hasMessages(history);
});