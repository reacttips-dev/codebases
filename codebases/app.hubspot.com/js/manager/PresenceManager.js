'use es6';

import { ping } from '../api/PresenceApi';
var PRESENCE_TIMEOUT = 60000;
var pingInterval;
export default {
  startPing: function startPing() {
    ping();
    pingInterval = setInterval(ping, PRESENCE_TIMEOUT);
  },
  stopPing: function stopPing() {
    clearInterval(pingInterval);
  }
};