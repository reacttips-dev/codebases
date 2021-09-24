'use es6';

import { createAction } from 'flux-actions';
import { REFRESH_WIDGET_DATA } from '../constants/actionTypes';
import { resetStubbedThread } from '../../stubbed-thread-history/actions/resetStubbedThread';
import { stageInitialMessage } from '../../actions/PublishActions/stageInitialMessage';
import { isCreatingThread } from '../../thread-create/selectors/stagedThreadSelectors';
import { getSelectedThreadId } from '../../selected-thread/selectors/getSelectedThreadId';
import { STUBBED_THREAD_ID } from '../../threads/constants/stubbedThreadId';
import { removeAllClientTriggers } from '../../client-triggers/actions/removeAllClientTriggers';
import { bootstrapInitialWidgetUi } from '../../initial-message-bubble/actions/bootstrapInitialWidgetUi';
export var refreshWidgetDataAction = createAction(REFRESH_WIDGET_DATA, function (widgetData) {
  return widgetData;
});
export function refreshWidgetData(widgetData) {
  return function (dispatch, getState) {
    dispatch(refreshWidgetDataAction(widgetData));
    var isStubbedThread = getSelectedThreadId(getState()) === STUBBED_THREAD_ID;
    var isViewingStubbedThread = isStubbedThread && !isCreatingThread(getState());

    if (isViewingStubbedThread) {
      dispatch(resetStubbedThread());
      dispatch(stageInitialMessage());
    }

    dispatch(removeAllClientTriggers());
    dispatch(bootstrapInitialWidgetUi(widgetData));
  };
}