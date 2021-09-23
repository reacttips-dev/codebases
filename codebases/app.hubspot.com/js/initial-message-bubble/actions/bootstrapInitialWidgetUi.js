'use es6';

import { getMessage } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { getPopOpenWidget } from 'conversations-internal-schema/message/operators/messageGetters';
import { getWidgetStartOpen } from '../../widget-ui/selectors/getWidgetStartOpen';
import { toggleInitialMessageBubble } from './toggleInitialMessageBubble';
import { getShowInitialMessage } from '../../selectors/getShowInitialMessage';
import { getIsMobile } from '../../selectors/getIsMobile';
import { toggleOpen } from '../../actions/WidgetActions';
import { hasClientTriggers } from '../../client-triggers/operators/hasClientTriggers';
import { scrollTriggerEnabled } from '../../scroll-percentage-trigger/operators/scrollTriggerEnabled';
import { postStartTrackScrollPercentage } from '../../scroll-percentage-trigger/actions/postStartTrackScrollPercentage';
import { timeOnPageTriggerEnabled } from '../../time-on-page-trigger/operators/timeOnPageTriggerEnabled';
import { addTimeOnPageTrigger } from '../../time-on-page-trigger/actions/addTimeOnPageTrigger';
import { exitIntentTriggerEnabled } from '../../exit-intent-trigger/operators/exitIntentTriggerEnabled';
import { gdprCookieConsentOnExitIntentEnabled } from '../../utils/gdprCookieConsentPromptHelpers';
import { postStartTrackExitIntent } from '../../exit-intent-trigger/postStartTrackExitIntent';
export var bootstrapInitialWidgetUi = function bootstrapInitialWidgetUi(widgetData) {
  return function (dispatch, getState) {
    var startOpen = getWidgetStartOpen(getState());
    var welcomeMessage = getMessage(widgetData);
    var mobile = getIsMobile(getState());
    var popOpenWidget = getPopOpenWidget(welcomeMessage);
    var shouldPopOpenWidget = popOpenWidget && !mobile;
    var showInitialMessage = getShowInitialMessage(getState());
    var shouldSetClientTriggers = showInitialMessage || shouldPopOpenWidget;
    var widgetMustBeOpen = Boolean(startOpen);
    var widgetMustBeClosed = startOpen === false;
    var hasExitIntentCookieConsent = gdprCookieConsentOnExitIntentEnabled(getState(), widgetData);

    if (scrollTriggerEnabled(widgetData)) {
      postStartTrackScrollPercentage();
    }

    if (timeOnPageTriggerEnabled(widgetData)) {
      dispatch(addTimeOnPageTrigger(widgetData));
    }

    if (exitIntentTriggerEnabled(widgetData) || hasExitIntentCookieConsent) {
      postStartTrackExitIntent();
    }

    if (widgetMustBeOpen) {
      dispatch(toggleOpen({
        isOpened: true
      }));
      dispatch(toggleInitialMessageBubble(showInitialMessage));
      return;
    }

    if (widgetMustBeClosed) {
      dispatch(toggleOpen({
        isOpened: false
      }));
      dispatch(toggleInitialMessageBubble(showInitialMessage));
      return;
    } // dont show inital message bubble or open the widget if client triggers are enabled


    if (shouldSetClientTriggers && hasClientTriggers(widgetData)) return;

    if (showInitialMessage) {
      dispatch(toggleInitialMessageBubble(true));
    } else {
      dispatch(toggleInitialMessageBubble(false));
    }

    if (shouldPopOpenWidget) {
      dispatch(toggleOpen({
        isOpened: true
      }));
    } else {
      dispatch(toggleOpen({
        isOpened: false
      }));
    }
  };
};