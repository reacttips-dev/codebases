'use es6';

import { AGENT_SENDER, BOT_SENDER } from 'conversations-message-history/common-message-format/constants/cmfSenderTypes';
import { SENT } from 'conversations-message-history/common-message-format/constants/statusTypes';
import { buildSender } from 'conversations-message-history/common-message-format/operators/buildSender';
import { buildInitialMessage } from 'conversations-message-history/initial-message/operators/buildInitialMessage';
import { generateUniqueClientTimestamp } from 'conversations-message-history/util/timestamps';
import { LIVE_CHAT } from 'conversations-internal-schema/constants/ThreadSources';
import { getUserId } from 'conversations-internal-schema/responders/operators/responderGetters';
import { getInitialResponder } from '../../responders/selectors/getInitialResponder';
import { getIsBot } from '../../selectors/widgetDataSelectors/getIsBot';
import { stageMessageOnStubbedThread } from '../../stubbed-thread-history/actions/stageMessageOnStubbedThread';
import { getFirstMessageText } from '../../thread-histories/selectors/getFirstMessageText';
import { stageSupplementalInitialMessages } from './stageSupplementalInitialMessages';
export function stageInitialMessage() {
  return function (dispatch, getState) {
    var state = getState();
    var isBot = getIsBot(state);
    var responderToUse = getInitialResponder(state);
    var senderId = getUserId(responderToUse);
    var timestamp = generateUniqueClientTimestamp();
    var unpublishedInitialMessage = buildInitialMessage({
      sender: buildSender({
        senderType: isBot ? BOT_SENDER : AGENT_SENDER,
        senderId: senderId
      }),
      status: {
        messageStatus: SENT,
        source: LIVE_CHAT,
        timestamp: timestamp
      },
      richText: getFirstMessageText(state),
      text: getFirstMessageText(state),
      timestamp: timestamp
    });
    dispatch(stageMessageOnStubbedThread(unpublishedInitialMessage));

    if (isBot) {
      dispatch(stageSupplementalInitialMessages()).done();
      return;
    }
  };
}