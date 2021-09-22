/*
 * You'll need to call setupHeartbeat before triggering any events.
 * When you trigger a listener for an event like 'heartbeat:1000',
 * this plugin will create a new interval and call the provided callback
 * every `interval` ms.
 */
import videojs from 'video.js';

import LucidJS from 'js/vendor/lucid.v2-7-0';

const DEFAULT_HEARTBEAT_INTERVAL = 5000;

const Heartbeat = function Heartbeat(player, waitInterval, callback) {
  const startHeartbeat = function () {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
    this.interval = window.setInterval(callback, parseInt(waitInterval, 10));
  };

  player.on('playing', startHeartbeat.bind(this));
  player.on(
    'pause',
    function () {
      window.clearInterval(this.interval);
    }.bind(this)
  );
  player.on(
    'dispose',
    function () {
      window.clearInterval(this.interval);
    }.bind(this)
  );
};

videojs.registerPlugin('setupHeartbeatListener', function () {
  const player = this;
  const heartbeats = [];

  if (!player.emitter) player.emitter = LucidJS.emitter();

  player.emitter.on('emitter.listener', function (evt, callback) {
    let heartbeatRegex;
    let match;

    heartbeatRegex = /^heartbeat(:(\d+))?$/;
    if ((match = heartbeatRegex.exec(evt))) {
      const waitInterval = match[2] || DEFAULT_HEARTBEAT_INTERVAL;
      heartbeats.push(new Heartbeat(player, waitInterval, callback));
    }
  });
});
