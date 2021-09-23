'use es6';

import { getSelectedThreadId } from '../../selected-thread/selectors/getSelectedThreadId';
import { getSessionId } from '../../selectors/widgetDataSelectors/getSessionId';
import { STUBBED_THREAD_ID } from '../../threads/constants/stubbedThreadId';
import { fetchThreadHistory } from './fetchThreadHistory';
export var fetchCurrentThreadHistory = function fetchCurrentThreadHistory() {
  return function (dispatch, getState) {
    var sessionId = getSessionId(getState());
    var threadId = getSelectedThreadId(getState());

    if (threadId === null || threadId === STUBBED_THREAD_ID) {
      return;
    }

    dispatch(fetchThreadHistory({
      threadId: threadId,
      sessionId: sessionId
    }));
  };
};