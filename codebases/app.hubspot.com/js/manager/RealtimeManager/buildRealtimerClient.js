'use es6';

import Ably from 'ably-hubspot-js';
export var buildRealtimeClient = function buildRealtimeClient(options) {
  return new Ably.Realtime(options);
};