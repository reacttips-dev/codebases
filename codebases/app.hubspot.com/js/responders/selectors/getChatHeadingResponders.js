'use es6';

import { createSelector } from 'reselect';
import { chatHeadingRespondersList } from '../operators/chatHeadingRespondersList';
import { getChatHeadingConfig } from '../../chat-heading-config/selectors/getChatHeadingConfig';
import { getAgentRespondersList } from './getAgentRespondersList';
import { getAssignedResponderInWidget } from './getAssignedResponderInWidget';
import { getSendFromResponders } from './getSendFromResponders';
export var getChatHeadingResponders = createSelector([getAssignedResponderInWidget, getChatHeadingConfig, getAgentRespondersList, getSendFromResponders], function (assignedResponder, chatHeadingConfig, responders, sendFromResponders) {
  return chatHeadingRespondersList({
    assignedResponder: assignedResponder,
    chatHeadingConfig: chatHeadingConfig,
    responders: responders,
    sendFromResponders: sendFromResponders
  });
});