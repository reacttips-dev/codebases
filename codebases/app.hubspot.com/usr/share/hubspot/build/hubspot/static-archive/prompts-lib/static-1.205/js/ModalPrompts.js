'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { debug, warn } from 'prompts-lib/util/DebugUtil';
import { makeMessage, parseMessage } from 'prompts-lib/util/MessagingUtil';
import { TYPE } from 'prompts-lib/constants/Messages';
import ModalPromptsUI from 'prompts-lib/view/ModalPromptsUI';

var ModalPrompts = function ModalPrompts() {
  var notificationsBacklog = [];

  var handleMessage = function handleMessage(event) {
    var message = parseMessage(event);

    if (!message) {
      return;
    }

    debug('Parent document received message', message);

    switch (message.type) {
      case TYPE.GET_NOTIFICATION:
        {
          var prompt = notificationsBacklog.length === 0 ? null : notificationsBacklog.shift();
          event.source.postMessage(makeMessage(TYPE.SEND_NOTIFICATION, prompt), event.origin);
          break;
        }

      case TYPE.RESIZE:
        {
          ModalPromptsUI.resize(message.payload);
          break;
        }

      case TYPE.SHOW:
        {
          ModalPromptsUI.show();
          break;
        }

      case TYPE.CLOSE:
        {
          ModalPromptsUI.close();
          break;
        }

      default:
        {
          warn('Unknown message type', message.type);
        }
    }
  };

  window.parent.addEventListener('message', function (ev) {
    return handleMessage(ev);
  });
  return {
    add: function add() {
      var notifications = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (!notifications || notifications.length === 0) {
        return;
      }

      notificationsBacklog = [].concat(_toConsumableArray(notificationsBacklog), _toConsumableArray(notifications));
      ModalPromptsUI.loadIframe();
    }
  };
};

export default ModalPrompts();