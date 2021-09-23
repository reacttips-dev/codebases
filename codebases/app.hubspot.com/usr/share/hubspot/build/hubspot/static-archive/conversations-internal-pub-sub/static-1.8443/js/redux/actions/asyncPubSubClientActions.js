'use es6';

import { silenceErrorAlert } from 'conversations-error-reporting/error-actions/builders/silenceErrorAlert';
import { INITIALIZE_PUBSUB, PUBSUB_READY, PUBSUB_RECONNECTED, PUBSUB_DISCONNECTED, PUBSUB_RECONNECTING, PUBSUB_SUSPENDED } from '../constants/actionTypes';
import { DEFAULT_CLIENT_KEY } from '../constants/clientKeys';
export var initializePubSubSucceeded = function initializePubSubSucceeded(client) {
  var clientKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_CLIENT_KEY;
  return {
    type: INITIALIZE_PUBSUB.SUCCEEDED,
    payload: {
      client: client,
      clientKey: clientKey
    }
  };
};
export var initializePubSubStarted = function initializePubSubStarted() {
  var clientKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_CLIENT_KEY;
  return {
    type: INITIALIZE_PUBSUB.STARTED,
    payload: {
      clientKey: clientKey
    }
  };
};
export var initializePubSubFailed = function initializePubSubFailed(error) {
  var clientKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_CLIENT_KEY;
  return {
    type: INITIALIZE_PUBSUB.FAILED,
    payload: {
      clientKey: clientKey,
      error: error
    },
    meta: silenceErrorAlert()
  };
};
export var pubSubReady = function pubSubReady() {
  var clientKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_CLIENT_KEY;
  return {
    type: PUBSUB_READY,
    payload: {
      clientKey: clientKey
    }
  };
};
export var pubSubReconnected = function pubSubReconnected() {
  var clientKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_CLIENT_KEY;
  return {
    type: PUBSUB_RECONNECTED,
    payload: {
      clientKey: clientKey
    }
  };
};
export var pubSubReconnecting = function pubSubReconnecting() {
  var clientKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_CLIENT_KEY;
  return {
    type: PUBSUB_RECONNECTING,
    payload: {
      clientKey: clientKey
    }
  };
};
export var pubSubDisconnected = function pubSubDisconnected() {
  var clientKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_CLIENT_KEY;
  return {
    type: PUBSUB_DISCONNECTED,
    payload: {
      clientKey: clientKey
    }
  };
};
export var pubSubSuspended = function pubSubSuspended() {
  var clientKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_CLIENT_KEY;
  return {
    type: PUBSUB_SUSPENDED,
    payload: {
      clientKey: clientKey
    }
  };
};