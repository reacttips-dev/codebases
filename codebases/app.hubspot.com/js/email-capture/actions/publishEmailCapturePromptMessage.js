'use es6';

import { LIVE_CHAT } from 'conversations-internal-schema/constants/ThreadSources';
import EmailCapturePromptMessage from 'conversations-message-history/email-capture-prompt/records/EmailCapturePromptMessage';
import { publishMessageToConversation } from '../../actions/PublishActions/publishMessageToConversation';
import { getHasVisitorEmail } from '../../selectors/widgetDataSelectors/getHasVisitorEmail';
import { canSendNewEmailCapturePromptMessage } from '../../thread-histories/operators/canSendNewEmailCapturePromptMessage';
import { historyDataForThread } from '../../thread-histories/selectors/historyDataForThread';
import { getThreadByThreadId } from '../../threads/selectors/getThreadByThreadId';
import { trackInteraction } from '../../usage-tracking/actions/trackInteraction';
import { chooseEmailCapturePromptText } from '../selectors/chooseEmailCapturePromptText';
import { getAssignedResponderInWidget } from '../../responders/selectors/getAssignedResponderInWidget';
import { getAgentType } from 'conversations-internal-schema/responders/operators/getAgentType';
import { BOT } from 'conversations-internal-schema/responders/constants/agentTypes';
import { SYSTEM_SENDER } from 'conversations-message-history/common-message-format/constants/cmfSenderTypes';
import { generateUuid } from 'conversations-message-history/util/generateUuid';
import { SENT } from 'conversations-message-history/common-message-format/constants/statusTypes';

var publishEmailCapturePromptMessage = function publishEmailCapturePromptMessage(_ref) {
  var channel = _ref.channel,
      threadId = _ref.threadId;
  return function (dispatch, getState) {
    var thread = getThreadByThreadId(getState(), {
      threadId: threadId
    });
    var threadHistory = historyDataForThread(getState(), {
      thread: thread
    });
    var responderIsBot = getAgentType(getAssignedResponderInWidget(getState())) === BOT;

    if (!canSendNewEmailCapturePromptMessage(threadHistory) || getHasVisitorEmail(getState()) || responderIsBot) {
      return;
    }

    var senderType = SYSTEM_SENDER;
    var message = new EmailCapturePromptMessage({
      id: generateUuid(),
      text: chooseEmailCapturePromptText(getState()),
      sender: {
        '@type': senderType
      },
      status: {
        source: LIVE_CHAT,
        messageStatus: SENT
      }
    });
    dispatch(publishMessageToConversation({
      channel: channel,
      message: message,
      threadId: threadId
    }));
    dispatch(trackInteraction('widget-interaction', {
      action: 'view email capture'
    }));
  };
};

export { publishEmailCapturePromptMessage as default, publishEmailCapturePromptMessage };