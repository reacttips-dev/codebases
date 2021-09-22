/**
 * Authenticates and allows third party widgets to communicate with Coursera.
 * Talks to coursera-connect.js
 */

import type { CourseraConnectMessage } from 'bundles/widget/types/Request';

import Q from 'q';
import _ from 'underscore';

import { generateId } from 'bundles/widget/utils';

type SendMessageToIFrame = (
  x0: {
    token: string;
    id: string;
    type: string;
    body?: any;
  },
  x1: string
) => void;

/**
 * given a token, event, and an optional request id, check to see if the event is valid CourseraConnectMessage
 */
function _isValidMessageEvent(token: string, event: MessageEvent, requestId?: string) {
  if (!event.data || !event.data.type || !event.data.token || !event.data.id) {
    return false;
  }

  const message: CourseraConnectMessage = event.data;

  // a requestId is required if the message is an expected response. not required if it's a request
  if (requestId) {
    return message.id === requestId && message.token === token;
  } else {
    return message.token === token;
  }
}

/**
 * Polls child every set interval to initiate token,
 * a unique identifier that authenticates communication between the iframe and the parent page
 */
function initiateChild(sendMessageToIFrame: SendMessageToIFrame, token: string, iFrameSrc: string): Q.Promise<string> {
  const deferred = Q.defer();
  const requestId = generateId();
  let intervalId: number | undefined;

  const initChildWithToken = function () {
    const message: CourseraConnectMessage = {
      token,
      id: requestId,
      type: 'INIT_CHILD',
    };
    sendMessageToIFrame(message, iFrameSrc);
  };

  const onMessage = function (event: MessageEvent) {
    if (!_isValidMessageEvent(token, event, requestId)) {
      return;
    }

    const childMessage: CourseraConnectMessage = event.data;
    if (childMessage.type === 'INIT_CHILD') {
      clearInterval(intervalId);
      window.removeEventListener('message', onMessage);
      deferred.resolve(token);
    }
  };

  // Constantly send initialization request to child until they respond.
  window.addEventListener('message', onMessage);
  intervalId = window.setInterval(initChildWithToken, 500);

  // @ts-expect-error TSMIGRATION
  return deferred.promise;
}

/**
 * Relay between iFrame and parent container.
 * Passes whitelisted request actions from iFrame to parent, then forwards parent responses back to iFrame.
 */
function _handleChildActionRequest(
  token: string,
  allowedTypes: Array<string>,
  onReceiveMessage: (request: CourseraConnectMessage) => Q.Promise<any>,
  sendMessageToIFrame: SendMessageToIFrame,
  event: MessageEvent
) {
  // Only allow correctly formatted messages.
  if (!_isValidMessageEvent(token, event)) {
    return;
  }

  const messageToParent: CourseraConnectMessage = event.data;

  if (_(allowedTypes).contains(messageToParent.type) || messageToParent.type === 'LOAD_WIDGET_ERROR') {
    onReceiveMessage(messageToParent).then((data) => {
      const response: CourseraConnectMessage = {
        token,
        id: messageToParent.id,
        type: messageToParent.type,
        body: data,
      };
      sendMessageToIFrame(response, event.origin);
    });
  } else {
    const response: CourseraConnectMessage = {
      token,
      id: messageToParent.id,
      type: 'ERROR',
      body: {
        // @ts-expect-error TSMIGRATION
        errorCode: 'MESSAGE_TYPE_NOT_ALLOWED',
      },
    };
    sendMessageToIFrame(response, event.origin);
  }
}

/**
 * Start listening to messages from child.
 * Should only be called once, immediately after initialization with child.
 *
 * Returns function to remove message listener.
 */
function listenToChildMessages(
  token: string,
  allowedTypes: Array<string>,
  onReceiveMessage: (request: CourseraConnectMessage) => Q.Promise<any>,
  sendMessageToIFrame: SendMessageToIFrame,
  iFrameSrc: string
): () => void {
  // Order matters. Must listen for child messages before answering child
  const onChildMessage = _.partial(
    _handleChildActionRequest,
    token,
    allowedTypes,
    onReceiveMessage,
    sendMessageToIFrame
  );
  window.addEventListener('message', onChildMessage);

  const message: CourseraConnectMessage = {
    token,
    id: generateId(),
    type: 'INIT_COMPLETE',
    // @ts-expect-error TSMIGRATION
    body: allowedTypes,
  };
  sendMessageToIFrame(message, iFrameSrc);

  const removeEventListener = () => {
    window.removeEventListener('message', onChildMessage);
  };

  return removeEventListener;
}

export default {
  initiateChild,
  listenToChildMessages,
};

export { initiateChild, listenToChildMessages };
