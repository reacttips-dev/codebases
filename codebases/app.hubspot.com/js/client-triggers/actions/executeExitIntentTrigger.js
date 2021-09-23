'use es6';

import { updateShowExitIntentCookieBanner } from '../../visitor-identity/actions/updateShowExitIntentCookieBanner';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
import { gdprCookieConsentOnExitIntentEnabled } from '../../utils/gdprCookieConsentPromptHelpers';
import { postStopTrackExitIntent } from '../../exit-intent-trigger/postStopTrackExitIntent';
import { exitIntentTriggerEnabled } from '../../exit-intent-trigger/operators/exitIntentTriggerEnabled';
import { getPopOpenWidget } from '../../selectors/widgetDataSelectors/getPopOpenWidget';
import { toggleOpen } from '../../actions/WidgetActions';
import { toggleInitialMessageBubble } from '../../initial-message-bubble/actions/toggleInitialMessageBubble';
import { getIsMobile } from '../../selectors/getIsMobile';
import { getWidgetStartOpen } from '../../widget-ui/selectors/getWidgetStartOpen';
import { shouldOverrideTrigger } from '../operators/shouldOverrideTrigger';
import { getShouldHideWelcomeMessage } from '../../selectors/getShouldHideWelcomeMessage';
export var executeExitIntentTrigger = function executeExitIntentTrigger() {
  return function (dispatch, getState) {
    postStopTrackExitIntent();
    var currentState = getState();
    var widgetData = getLatestWidgetData(currentState);
    var shouldNotOverrideTrigger = !shouldOverrideTrigger(getWidgetStartOpen(currentState));

    if (gdprCookieConsentOnExitIntentEnabled(currentState, widgetData)) {
      dispatch(updateShowExitIntentCookieBanner(true));
    }

    if (exitIntentTriggerEnabled(widgetData) && getPopOpenWidget(currentState) && !getIsMobile(currentState) && shouldNotOverrideTrigger) {
      dispatch(toggleOpen({
        isOpened: true
      }));
    } else if (exitIntentTriggerEnabled(widgetData) && !getShouldHideWelcomeMessage(currentState)) {
      dispatch(toggleInitialMessageBubble(true));
    }
  };
};