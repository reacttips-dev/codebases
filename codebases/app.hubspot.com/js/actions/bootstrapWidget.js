'use es6';

import get from 'transmute/get';
import { createAction } from 'flux-actions';
import { selectThread } from '../selected-thread/actions/selectThread';
import { STUBBED_THREAD_ID } from '../threads/constants/stubbedThreadId';
import { GET_WIDGET_DATA_SUCCEEDED, RECEIVED_WIDGET_SHELL_DATA } from '../constants/VisitorActionTypes';
import { handleStoreMessagesCookie } from '../post-message/handleStoreMessagesCookie';
import { trackInteraction } from '../usage-tracking/actions/trackInteraction';
import { buildWidgetData } from '../widget-data/operators/buildWidgetData';
import { bootstrapInitialWidgetUi } from '../initial-message-bubble/actions/bootstrapInitialWidgetUi';
import { getIsIncludedInPageViewSample } from '../usage-tracking/selectors/getIsIncludedInPageViewSample';
import { messageCookieHandler } from '../gdpr/operators/messageCookieHandler';
import { getMessagesUtk } from '../query-params/getMessagesUtk';
import { PAGEVIEW_SAMPLE_PERCENT } from '../usage-tracking/constants/pageViewSamplePercent';
export var receivedWidgetData = createAction(GET_WIDGET_DATA_SUCCEEDED, function (widgetData) {
  return widgetData;
});
export var receivedWidgetShellData = createAction(RECEIVED_WIDGET_SHELL_DATA, function (widgetData) {
  return widgetData;
});
export default function bootstrapWidget(data) {
  return function (dispatch, getState) {
    var widgetData = buildWidgetData(data);

    if (!get('sessionId', widgetData) || !get('chatflowId', widgetData)) {
      return;
    }

    dispatch(selectThread(STUBBED_THREAD_ID));
    var shouldStoreMessagesCookie = messageCookieHandler({
      currentState: getState(),
      widgetData: widgetData
    });

    if (shouldStoreMessagesCookie) {
      handleStoreMessagesCookie(getMessagesUtk());
    }

    if (getIsIncludedInPageViewSample()) {
      dispatch(trackInteraction('pageview', {
        screen: 'widget',
        subscreen: 'thread view',
        action: 'rendered widget',
        pageViewSamplePercent: PAGEVIEW_SAMPLE_PERCENT
      }));
    }

    dispatch(receivedWidgetData(widgetData));
    dispatch(receivedWidgetShellData(data));
    dispatch(bootstrapInitialWidgetUi(widgetData));
  };
}