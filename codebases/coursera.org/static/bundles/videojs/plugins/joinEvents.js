/**
 * This plugin sends events that measures the amount of time
 * that users have to wait before their video starts playing
 * It triggers two events:
 *
 * - 'joining': triggered when the video when the user or autoplay
 *   attempts to start the video and the video has not successfully
 *   started playing yet.
 *   May be sent more than once per session.
 * - 'joined': triggered when the video starts playing for the first time.
 *   Will be sent only once per session.
 */
import videojs from 'video.js';

videojs.registerPlugin('joinEvents', function () {
  this.eventEmitter();
  let joiningAt = null;
  let joinedAt = null;
  let hasJoined = false;

  const triggerJoining = function () {
    if (!hasJoined) {
      joiningAt = new Date();
      this.trigger('joining');
    }
  };

  const triggerJoined = function () {
    joinedAt = new Date();
    hasJoined = true;
    this.emitter.set('joined', {
      joinDuration: joinedAt - joiningAt,
    });
    this.off('play', triggerJoining);
  };

  this.on('play', triggerJoining);
  this.one('durationchange', triggerJoined);
});
