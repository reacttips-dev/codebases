'use es6';

import { DEFAULT_CLIENT_KEY } from '../constants/clientKeys';
import { initializePubSubStarted, initializePubSubSucceeded, initializePubSubFailed, pubSubReady, pubSubReconnected, pubSubDisconnected, pubSubReconnecting, pubSubSuspended } from './asyncPubSubClientActions';

var noop = function noop() {};

var DEFAULT_LIFECYCLE_HOOKS = {
  onConnect: noop,
  onConnecting: noop,
  onDisconnect: noop,
  onFailure: noop,
  onSuspended: noop
};
/**
 * @typedef lifeCycleHooks
 * @type {Object}
 * @property {function} onConnect - Called when the client has connected
 * @property {function} onConnecting - Called when the client is connecting
 * @property {function} onDisconnect - Called when the client has disconnected
 * @property {function} onSuspended - Called when the client becomes suspended
 * @property {function} onFailure - Called when the client fails (not recoverable)
 */

/**
 * Initialize a connection
 *
 * @param {Object} connectionConfig - connection configuration
 * @param {Object} connectionConfig.clientOptions - Ably client options found here https://www.ably.io/documentation/realtime/usage#client-options
 * @param {lifeCycleHooks} connectionConfig.lifeCycleHooks - Connection life cycle callbacks
 * @param {function} connectionConfig.resolveBuilder - A resolver function to load the pub sub code split
 */

export var initializePubSub = function initializePubSub(_ref) {
  var clientOptions = _ref.clientOptions,
      _ref$lifecycleHooks = _ref.lifecycleHooks,
      lifecycleHooks = _ref$lifecycleHooks === void 0 ? DEFAULT_LIFECYCLE_HOOKS : _ref$lifecycleHooks,
      resolveBuilder = _ref.resolveBuilder,
      _ref$clientKey = _ref.clientKey,
      clientKey = _ref$clientKey === void 0 ? DEFAULT_CLIENT_KEY : _ref$clientKey;
  return function (dispatch) {
    dispatch(initializePubSubStarted(clientKey));
    lifecycleHooks = Object.assign({}, DEFAULT_LIFECYCLE_HOOKS, {}, lifecycleHooks);
    return resolveBuilder().then(function (_ref2) {
      var buildConversationsPubSub = _ref2.buildConversationsPubSub;
      var client = buildConversationsPubSub({
        clientOptions: clientOptions,
        lifecycleHooks: Object.assign({}, lifecycleHooks, {
          onConnect: function onConnect(params) {
            if (params.reconnected) {
              dispatch(pubSubReconnected(clientKey));
            } else {
              dispatch(pubSubReady(clientKey));
            }

            lifecycleHooks.onConnect(params);
          },
          onConnecting: function onConnecting(_ref3) {
            var reconnecting = _ref3.reconnecting;

            if (reconnecting) {
              dispatch(pubSubReconnecting(clientKey));
            }

            lifecycleHooks.onConnecting({
              reconnecting: reconnecting
            });
          },
          onDisconnect: function onDisconnect() {
            dispatch(pubSubDisconnected(clientKey));
            lifecycleHooks.onDisconnect();
          },
          onSuspended: function onSuspended() {
            dispatch(pubSubSuspended(clientKey));
            lifecycleHooks.onSuspended();
          }
        })
      });
      dispatch(initializePubSubSucceeded(client, clientKey));
      client.connect();
    }, function (error) {
      dispatch(initializePubSubFailed(error, clientKey));
      throw error;
    });
  };
};