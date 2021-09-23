'use es6';

import { getQuickReply } from 'conversations-message-history/common-message-format/operators/cmfQuickReplyGetters';
import { getText, getRichText } from 'conversations-message-history/initial-message/operators/initialMessageGetters';
import { LIVE_CHAT } from 'conversations-internal-schema/constants/ThreadSources';
import { buildSender } from 'conversations-message-history/common-message-format/operators/buildSender';
import { toCmfSender } from 'conversations-message-history/common-message-format/operators/cmfSenderInterop';
import { BOT_SENDER } from 'conversations-message-history/common-message-format/constants/cmfSenderTypes';
import QuickReplyAttachment from 'conversations-message-history/common-message-format/records/QuickReplyAttachment';
import { NO_CONTENT } from '../../constants/HttpStatusCodes';
import { buildInitialMessage } from 'conversations-message-history/initial-message/operators/buildInitialMessage';
import { generateUniqueClientTimestamp } from 'conversations-message-history/util/timestamps';
import { getUserId } from 'conversations-internal-schema/responders/operators/responderGetters';
import { createAction } from 'flux-actions';
import { getIsWidgetInAwayMode } from '../../availability/selectors/getIsWidgetInAwayMode';
import { fetchSupplementalInitialMessages } from '../../clients/fetchSupplementalInitialMessages';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import { getAssignedResponderInWidget } from '../../responders/selectors/getAssignedResponderInWidget';
import { getSessionId } from '../../selectors/widgetDataSelectors/getSessionId';
import { stageMessageOnStubbedThread } from '../../stubbed-thread-history/actions/stageMessageOnStubbedThread';
import { getHubspotUtk } from '../../query-params/hubspotUtk';
var fetchSupplementalInitialMessagesStarted = createAction(ActionTypes.GET_SUPPLEMENTAL_INITIAL_MESSAGES);
export var fetchSupplementalInitialMessagesSucceeded = createAction(ActionTypes.GET_SUPPLEMENTAL_INITIAL_MESSAGES_SUCCEEDED);
var fetchSupplementalInitialMessagesFailed = createAction(ActionTypes.GET_SUPPLEMENTAL_INITIAL_MESSAGES_FAILED, function (error) {
  return {
    error: error
  };
});
export function stageSupplementalInitialMessages() {
  return function (dispatch, getState) {
    var state = getState();

    if (getIsWidgetInAwayMode(state)) {
      return Promise.resolve();
    }

    var responder = getAssignedResponderInWidget(state);
    var botId = getUserId(responder);
    var sessionId = getSessionId(state);
    var hubspotUtk = getHubspotUtk();
    dispatch(fetchSupplementalInitialMessagesStarted());
    return fetchSupplementalInitialMessages({
      botId: botId,
      sessionId: sessionId,
      hubspotUtk: hubspotUtk
    }).then(function (response) {
      var messageContainers = response.status === NO_CONTENT ? [] : response.data;
      dispatch(fetchSupplementalInitialMessagesSucceeded());
      messageContainers.forEach(function (_ref) {
        var message = _ref.message;
        var attachments = [];
        var quickReply = getQuickReply(message);

        if (quickReply) {
          attachments.push(new QuickReplyAttachment(quickReply));
        }

        var unpublishedInitialMessage = buildInitialMessage({
          id: message.id,
          clientType: message.clientType,
          sender: buildSender({
            senderType: toCmfSender(message.senderType) || BOT_SENDER,
            senderId: message.senderId
          }),
          status: Object.assign({}, message.status, {
            source: LIVE_CHAT
          }),
          attachments: attachments,
          text: getText(message),
          richText: getRichText(message),
          timestamp: generateUniqueClientTimestamp()
        });
        dispatch(stageMessageOnStubbedThread(unpublishedInitialMessage));
      });
    }, function (error) {
      dispatch(fetchSupplementalInitialMessagesFailed(error));
    });
  };
}