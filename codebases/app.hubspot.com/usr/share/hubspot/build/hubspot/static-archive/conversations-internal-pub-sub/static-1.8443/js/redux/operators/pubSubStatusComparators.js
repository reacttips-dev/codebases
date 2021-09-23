'use es6';

import { getStatus } from 'conversations-async-data/async-data/operators/getters';
import { CONNECTED, DISCONNECTED, RECONNECTING, RESUBSCRIBING, SUSPENDED } from '../constants/states';
/**
 * True when the client is connected
 *
 * @param {AsyncData} asyncPubSubClient - AsyncData containing the pub sub client
 * @returns {Boolean}
 */

export var isConnected = function isConnected(asyncPubSubClient) {
  return getStatus(asyncPubSubClient) === CONNECTED;
};
/**
 * True when the client is disconnected
 *
 * @param {AsyncData} asyncPubSubClient - AsyncData containing the pub sub client
 * @returns {Boolean}
 */

export var isDisconnected = function isDisconnected(asyncPubSubClient) {
  return getStatus(asyncPubSubClient) === DISCONNECTED;
};
/**
 * True when the client is isReconnecting
 *
 * @param {AsyncData} asyncPubSubClient - AsyncData containing the pub sub client
 * @returns {Boolean}
 */

export var isReconnecting = function isReconnecting(asyncPubSubClient) {
  return getStatus(asyncPubSubClient) === RECONNECTING;
};
/**
 * True when the subscriptions is isReconnecting
 *
 * @param {AsyncData} asyncSubscriptions - AsyncData containing the subscriptions
 * @returns {Boolean}
 */

export var isResubscribing = function isResubscribing(asyncSubscriptions) {
  return getStatus(asyncSubscriptions) === RESUBSCRIBING;
};
/**
 * True when the client is isReconnecting
 *
 * @param {AsyncData} asyncPubSubClient - AsyncData containing the pub sub client
 * @returns {Boolean}
 */

export var isSuspended = function isSuspended(asyncPubSubClient) {
  return getStatus(asyncPubSubClient) === SUSPENDED;
};