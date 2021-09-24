'use es6';

import { SYSTEM } from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import TypicalResponseTimeMessage from 'conversations-message-history/typical-response-time/records/TypicalResponseTimeMessage';
import { LIVE_CHAT } from 'conversations-internal-schema/constants/ThreadSources';
import { getAvailabilityTypicalResponseTimeMessage } from '../../availability/selectors/getAvailabilityTypicalResponseTimeMessage';
import { publishMessageToConversation } from '../../actions/PublishActions/publishMessageToConversation';
import { trackInteraction } from '../../usage-tracking/actions/trackInteraction';
import { generateUuid } from 'conversations-message-history/util/generateUuid';
import { SENT } from 'conversations-message-history/common-message-format/constants/statusTypes';
export var publishTypicalResponseTimeMessage = function publishTypicalResponseTimeMessage(_ref) {
  var channel = _ref.channel,
      threadId = _ref.threadId;
  return function (dispatch, getState) {
    var senderType = SYSTEM;
    var message = new TypicalResponseTimeMessage({
      id: generateUuid(),
      text: getAvailabilityTypicalResponseTimeMessage(getState()),
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
      action: 'view reply time'
    }));
  };
};