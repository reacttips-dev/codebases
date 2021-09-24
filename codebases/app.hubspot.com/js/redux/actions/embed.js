'use es6';

import { getEmbeddedContext } from '../selectors/embed';
import { MSG_TYPE_MODAL_DIALOG_CLOSE } from 'ui-addon-iframeable/messaging/IFrameMessageTypes';
import { COMPOSER_MESSAGE_TYPES } from '../../lib/constants';

var postMessageToHost = function postMessageToHost(type) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var message = {
    type: type,
    data: data
  };
  window.parent.postMessage(JSON.stringify(message), '*');
};

export var sendMessageToHost = function sendMessageToHost(messageType, data) {
  return function (dispatch, getState) {
    var embeddedContext = getEmbeddedContext(getState());

    if (embeddedContext) {
      if (messageType === COMPOSER_MESSAGE_TYPES.exit) {
        messageType = MSG_TYPE_MODAL_DIALOG_CLOSE;
      }

      embeddedContext.sendMessage(messageType, data);
    } else {
      postMessageToHost(messageType, data);
    }
  };
};