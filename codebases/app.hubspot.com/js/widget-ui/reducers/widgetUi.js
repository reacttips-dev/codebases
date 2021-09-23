'use es6';

import * as ActionTypes from '../../constants/VisitorActionTypes';
import { TOGGLE_INITIAL_MESSAGE_BUBBLE } from '../../initial-message-bubble/constants/initialMessageBubbleActionTypes';
import WidgetUi from '../records/WidgetUi';
var TOGGLE_OPEN = ActionTypes.TOGGLE_OPEN,
    RECEIVED_WIDGET_SHELL_DATA = ActionTypes.RECEIVED_WIDGET_SHELL_DATA,
    TRACK_USER_INTERACTION = ActionTypes.TRACK_USER_INTERACTION;

var parseShellData = function parseShellData(data) {
  return {
    mobile: "" + data.mobile === 'true',
    open: "" + data.open === 'true',
    hideWelcomeMessage: "" + data.hideWelcomeMessage === 'true',
    domain: data.domain,
    startOpen: data.startOpen,
    url: decodeURIComponent(data.url),
    userInteractedWithWidget: false,
    isEmbeddedInProduct: "" + data.inApp53 === 'true'
  };
};

export default function widgetUi() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : WidgetUi();
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case TOGGLE_INITIAL_MESSAGE_BUBBLE:
      if (!action.payload.visible && action.payload.closedByUser) {
        return state.set('startOpen', false).set('hideWelcomeMessage', true);
      }

      return state;

    case RECEIVED_WIDGET_SHELL_DATA:
      return state.merge(parseShellData(action.payload));

    case TOGGLE_OPEN:
      if (!action.payload.isOpened && action.payload.isUser) {
        state = state.set('startOpen', false).set('hideWelcomeMessage', true);
      }

      return state.set('open', action.payload.isOpened);

    case TRACK_USER_INTERACTION:
      return state.set('userInteractedWithWidget', true);

    default:
      return state;
  }
}