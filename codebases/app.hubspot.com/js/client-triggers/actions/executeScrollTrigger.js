'use es6';

import { toggleOpen } from '../../actions/WidgetActions';
import { getPopOpenWidget } from '../../selectors/widgetDataSelectors/getPopOpenWidget';
import { toggleInitialMessageBubble } from '../../initial-message-bubble/actions/toggleInitialMessageBubble';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
import { scrollTriggerEnabled } from '../../scroll-percentage-trigger/operators/scrollTriggerEnabled';
import { postStopTrackScrollPercentage } from '../../scroll-percentage-trigger/actions/postStopTrackScrollPercentage';
import { getIsMobile } from '../../selectors/getIsMobile';
import { getWidgetStartOpen } from '../../widget-ui/selectors/getWidgetStartOpen';
import { shouldOverrideTrigger } from '../operators/shouldOverrideTrigger';
import { getShouldHideWelcomeMessage } from '../../selectors/getShouldHideWelcomeMessage';
export var executeScrollTrigger = function executeScrollTrigger() {
  return function (dispatch, getState) {
    postStopTrackScrollPercentage();
    var currentState = getState();
    var widgetData = getLatestWidgetData(currentState);
    var shouldNotOverrideTrigger = !shouldOverrideTrigger(getWidgetStartOpen(currentState));

    if (scrollTriggerEnabled(widgetData) && getPopOpenWidget(currentState) && !getIsMobile(currentState) && shouldNotOverrideTrigger) {
      dispatch(toggleOpen({
        isOpened: true
      }));
    } else if (scrollTriggerEnabled(widgetData) && !getShouldHideWelcomeMessage(currentState)) {
      dispatch(toggleInitialMessageBubble(true));
    }
  };
};