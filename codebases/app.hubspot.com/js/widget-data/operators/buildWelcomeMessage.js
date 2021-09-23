'use es6';

import get from 'transmute/get';
import { fromJS } from 'immutable';
import Message from 'conversations-internal-schema/message/records/Message';
import { buildChatHeadingConfigFromJS } from 'conversations-internal-schema/chat-heading-config/builders/buildChatHeadingConfigFromJS';
import { buildClientTriggers } from 'conversations-internal-schema/client-triggers/factories/buildClientTriggers';
export function buildWelcomeMessage() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var clientTriggersData = get('clientTriggers', data);
  var chatHeadingConfigData = get('chatHeadingConfig', data);
  var messageRecordInstance = Message(fromJS(data));
  return messageRecordInstance.merge({
    clientTriggers: buildClientTriggers(clientTriggersData),
    chatHeadingConfig: buildChatHeadingConfigFromJS(chatHeadingConfigData)
  });
}