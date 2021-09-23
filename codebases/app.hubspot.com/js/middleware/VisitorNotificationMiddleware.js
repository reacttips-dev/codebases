'use es6';

import debounce from 'hs-lodash/debounce';
import { notifyBySound } from '../sound-notifications/notifyBySound';
import { isCommonMessageFormat, isEmailCMF } from 'conversations-message-history/common-message-format/operators/cmfComparators';
import * as ActionTypes from '../constants/VisitorActionTypes';
import { AGENT, BOT } from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import { getSenderType } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
var NOTIFICATION_DEBOUNCE_MS = 2000;

var VisitorNotificationMiddleware = function VisitorNotificationMiddleware() {
  var playNotifications = debounce(function () {
    notifyBySound(false);
  }, NOTIFICATION_DEBOUNCE_MS, {
    leading: true,
    trailing: false,
    maxWait: NOTIFICATION_DEBOUNCE_MS
  });

  function isRecipientMessage(message) {
    var from = getSenderType(message);
    return from === AGENT || from === BOT;
  }

  return function (next) {
    return function (action) {
      switch (action.type) {
        case ActionTypes.RECEIVED_INCOMING_MESSAGE:
          {
            var _action$payload = action.payload,
                message = _action$payload.message,
                shouldNotify = _action$payload.shouldNotify;

            if (shouldNotify && isRecipientMessage(message) && isCommonMessageFormat(message) && !isEmailCMF(message)) {
              playNotifications();
            }

            break;
          }

        case ActionTypes.OPEN_CONVERSATION_FOR_NEW_CHANNEL:
          {
            var shouldNotifyBySound = action.payload.shouldNotifyBySound;

            if (shouldNotifyBySound) {
              playNotifications();
            }

            break;
          }

        default:
          break;
      }

      return next(action);
    };
  };
};

export default VisitorNotificationMiddleware;