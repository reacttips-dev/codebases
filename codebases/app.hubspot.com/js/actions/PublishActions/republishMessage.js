'use es6';

import { publishMessage } from '../../pubsub/actions/publishMessage';
import { getUnpublishedMessage } from '../../pubsub/operators/getUnpublishedMessage';
import { getSelectedThreadId } from '../../selected-thread/selectors/getSelectedThreadId';
import { removeMessageInConversation } from '../../thread-histories/actions/removeMessageInConversation';
import { getThreadByThreadId } from '../../threads/selectors/getThreadByThreadId';
import { trackInteraction } from '../../usage-tracking/actions/trackInteraction';
import { getChannelName } from '../../threads/operators/threadGetters';
export function republishMessage(message) {
  return function (dispatch, getState) {
    var threadId = getSelectedThreadId(getState());
    var thread = getThreadByThreadId(getState(), {
      threadId: threadId
    });
    var channel = getChannelName(thread);
    var unpublishedMessage = getUnpublishedMessage(message);
    dispatch(removeMessageInConversation({
      message: unpublishedMessage,
      threadId: threadId
    }));
    dispatch(publishMessage({
      channel: channel,
      message: unpublishedMessage,
      threadId: threadId
    }));
    dispatch(trackInteraction('republish-message'));
  };
}