/*
 * Sends a periodic 'waitmetrics' event with the following properties on the event object:
 * waitDuration: Amount of time (in ms) spent playing since the last event.
 * waitDuration: Amount of time (in ms) spent waiting since the last event.
 * waitCount: Number of waits since the last event.
 */
import videojs from 'video.js';

const attachWaitTimer = function (video) {
  // Possible states for the video player
  const STOPPED = 'STOPPED'; // The video player is stopped because it is paused or finished.
  const WAITING = 'WAITING'; // The video player is stopped due to buffering.
  const PLAYING = 'PLAYING'; // The video player is playing.

  // Interval between timer ticks (ms)
  const TIMER_INTERVAL = 100;

  // Amount of time (in ms) of activity to record before triggering an event.
  const BATCH_DURATION = 15000;

  /*
   * Ignore waits that are shorter than this duration,
   * which prevents recording of spurious waits caused by
   * currentTime not updating fast enough.
   * We pick 250ms because currentTime should update every 250ms:
   * http://www.w3.org/TR/2011/WD-html5-20110113/video.html
   */
  const MIN_WAIT_DURATION = 250;

  // Timestamp of most recent timer tick.
  let lastTimerTickAt = null;

  // Most recent recorded position (ms) of video playback.
  let lastCurrentTime = 0;

  // Current state of the video.
  let lastVideoState = STOPPED;

  // Amount of time (in ms) spent playing.
  let playDuration = 0;

  // Amount of time (in ms) spent waiting.
  let waitDuration = 0;

  // Number of times that the video has transitioned from a non-waiting to waiting state.
  let waitCount = 0;

  // Timer that records activity every tick.
  let timer = null;

  // Reset the play and wait duration timers.
  const resetTimers = function () {
    playDuration = 0;
    waitDuration = 0;
    waitCount = 0;
  };

  // Trigger a waitingUpdate event on the video player.
  const triggerEvent = function () {
    if (playDuration > 0 || waitDuration > 0 || waitCount > 0) {
      video.trigger({
        type: 'waitmetrics',
        playDuration,
        waitDuration,
        waitCount,
      });
      resetTimers();
    }
  };

  const stopTimer = function () {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const timerTick = function () {
    // If the video element is unloaded, stop the timer.
    if (!video.contentEl()) {
      stopTimer();
      return;
    }

    // Get the current timestamps and video state.
    const now = new Date();
    const currentTime = video.currentTime();
    let videoState;
    if (video.paused()) {
      videoState = STOPPED;
    } else if (currentTime > lastCurrentTime) {
      videoState = PLAYING;
    } else {
      videoState = WAITING;
    }

    // Get the true duration elapsed since the last tick,
    // which may be different from TIMER_INTERVAL.
    const tickDuration = now - lastTimerTickAt;

    /*
     * If the player appears to be waiting but the wait
     * seems very short, discard this tick.
     * This prevents recording of spurious waits caused by
     * currentTime not updating fast enough.
     */
    if (lastVideoState !== WAITING && videoState === WAITING && tickDuration < MIN_WAIT_DURATION) {
      return;
    }

    // Record the activity.
    if (lastVideoState !== WAITING && videoState === WAITING) {
      waitCount += 1;
    }
    if (videoState === PLAYING) {
      playDuration += tickDuration;
    } else if (videoState === WAITING) {
      waitDuration += tickDuration;
    } else if (videoState === STOPPED) {
      stopTimer();

      // If stopped, immediately trigger an event.
      triggerEvent();
    }

    // If we have recorded enough activity, trigger an event.
    if (playDuration + waitDuration >= BATCH_DURATION) {
      triggerEvent();
    }

    // Save the current timestamps and video state.
    lastTimerTickAt = now;
    lastCurrentTime = currentTime;
    lastVideoState = videoState;
  };

  const startTimer = function () {
    if (!timer) {
      lastTimerTickAt = new Date();
      timer = setInterval(timerTick, TIMER_INTERVAL);
    }
  };

  // Start the timer when the user or autoplay starts the video,
  // or when the video time changes.
  video.on('play', startTimer);
  video.on('timeupdate', startTimer);
};

videojs.registerPlugin('waitEvents', function () {
  attachWaitTimer(this);
});
