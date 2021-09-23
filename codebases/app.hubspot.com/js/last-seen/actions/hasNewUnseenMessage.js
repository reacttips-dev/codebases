'use es6';

import I18n from 'I18n';
import { incrementUnseenCount } from '../../actions/ConversationsActions/incrementUnseenCount';
import { postShowPageTitleNotification } from '../../page-title-notifications/actions/post-message/postShowPageTitleNotification';
export var hasNewUnseenMessage = function hasNewUnseenMessage(_ref) {
  var channel = _ref.channel,
      threadId = _ref.threadId;
  return function (dispatch) {
    dispatch(incrementUnseenCount({
      channel: channel,
      threadId: threadId
    }));
    postShowPageTitleNotification({
      title: I18n.text('conversationsVisitorUIPageTitleNotifications.newMessage')
    });
  };
};