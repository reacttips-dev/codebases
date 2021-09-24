'use es6';

import { createSelector } from 'reselect';
import { getAssignedResponderInWidget } from './getAssignedResponderInWidget';
import { getPotentialResponders } from './getPotentialResponders';
import { getWidgetBotResponder } from '../../selectors/widgetDataSelectors/getWidgetBotResponder';
export var getInitialResponder = createSelector([getAssignedResponderInWidget, getPotentialResponders, getWidgetBotResponder], function (responder, responders, botResponder) {
  if (botResponder) {
    return botResponder;
  }

  return responder || responders.get(0);
});