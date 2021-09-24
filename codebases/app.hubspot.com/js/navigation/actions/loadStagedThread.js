'use es6';

import { STUBBED_THREAD_ID } from '../../threads/constants/stubbedThreadId';
import { selectThread } from '../../selected-thread/actions/selectThread';
import { resetStubbedThread } from '../../stubbed-thread-history/actions/resetStubbedThread';
import { updateView } from '../../current-view/actions/updateView';
import { THREAD_VIEW } from '../../current-view/constants/views';
import { stageInitialMessage } from '../../actions/PublishActions/stageInitialMessage';
export function loadStagedThread() {
  return function (dispatch) {
    dispatch(selectThread(STUBBED_THREAD_ID));
    dispatch(resetStubbedThread());
    dispatch(updateView(THREAD_VIEW));
    dispatch(stageInitialMessage());
  };
}