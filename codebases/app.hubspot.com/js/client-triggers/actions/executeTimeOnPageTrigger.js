'use es6';

import { toggleOpen } from '../../actions/WidgetActions';
import { getPopOpenWidget } from '../../selectors/widgetDataSelectors/getPopOpenWidget';
import { toggleInitialMessageBubble } from '../../initial-message-bubble/actions/toggleInitialMessageBubble';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
import { removeTimeOnPageTrigger } from '../../time-on-page-trigger/actions/removeTimeOnPageTrigger';
import { timeOnPageTriggerEnabled } from '../../time-on-page-trigger/operators/timeOnPageTriggerEnabled';
import { getIsMobile } from '../../selectors/getIsMobile';
import { getWidgetStartOpen } from '../../widget-ui/selectors/getWidgetStartOpen';
import { shouldOverrideTrigger } from '../operators/shouldOverrideTrigger';
import { getShouldHideWelcomeMessage } from '../../selectors/getShouldHideWelcomeMessage';
export var executeTimeOnPageTrigger = function executeTimeOnPageTrigger() {
  return function (dispatch, getState) {
    dispatch(removeTimeOnPageTrigger());
    var currentState = getState();
    var widgetData = getLatestWidgetData(currentState);
    var shouldNotOverrideTrigger = !shouldOverrideTrigger(getWidgetStartOpen(currentState));

    if (timeOnPageTriggerEnabled(widgetData) && getPopOpenWidget(currentState) && !getIsMobile(currentState) && shouldNotOverrideTrigger) {
      dispatch(toggleOpen({
        isOpened: true
      }));
    } else if (timeOnPageTriggerEnabled(widgetData) && !getShouldHideWelcomeMessage(currentState)) {
      dispatch(toggleInitialMessageBubble(true));
    }
  };
};