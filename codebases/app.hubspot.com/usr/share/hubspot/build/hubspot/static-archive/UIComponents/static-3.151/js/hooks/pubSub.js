'use es6';

import { useEffect, useRef } from 'react';
var channelSubscriptions = {};
var channelCount = 0;
export var makePubSubChannel = function makePubSubChannel() {
  return channelCount++;
};
/**
 * Returns the same channel on every call.
 * @return {number}
 */

export var usePubSubChannel = function usePubSubChannel() {
  var channelRef = useRef();

  if (channelRef.current == null) {
    channelRef.current = makePubSubChannel();
  }

  return channelRef.current;
};
/**
 * @param {number} channel
 * @return {Function} A function that publishes a message to all subscribers on the given channel
 */

export var usePublish = function usePublish(channel) {
  return function (message) {
    var subscriptions = channelSubscriptions[channel];

    if (subscriptions) {
      subscriptions.forEach(function (listener) {
        listener(message);
      });
    }
  };
};
/**
 * @param {number} channel
 * @param {Function} listener A function that's called with messages published on the given channel
 */

export var useSubscribe = function useSubscribe(channel, listener) {
  if (!channelSubscriptions[channel]) {
    channelSubscriptions[channel] = new Set(); // eslint-disable-line no-restricted-globals
  }

  channelSubscriptions[channel].add(listener); // Unsubscribe on unmount, or if the same component passes in different params

  useEffect(function () {
    return function () {
      channelSubscriptions[channel].delete(listener);
    };
  }, [channel, listener]);
};