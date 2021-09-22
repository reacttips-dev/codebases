// This enables us to calculate hard exit and bounce rates across site.

import Multitracker from 'js/app/multitrackerSingleton';

const HEARTBEAT_INTERVAL_LENGTH = 500;

const HEARTBEAT_MAX_INTERVALS = 10;

// We don't want/need in-course or admin pages.
const DENYLISTED_APPS = [
  'ondemand',
  'teach-course',
  'teach-program',
  'teach-partner-2018',
  'degrees-home',
  'admin',
  'admin-dashboard',
];

function sendHeartbeatEvent(heartbeatIntervalCount: number) {
  Multitracker.pushV2([
    'visit.heartbeat.interval',
    {
      // @ts-ignore FIXME does not recognize global window
      appName: window?.appName,
      url: window?.location?.href,
      heartbeatIntervalCount,
    },
  ]);
}

function startHeartbeatTracking(intervalLengthMs: number) {
  let heartbeatIntervalCount = 1;

  const heartbeatInterval = setInterval(() => {
    sendHeartbeatEvent(heartbeatIntervalCount);
    heartbeatIntervalCount += 1;

    if (heartbeatIntervalCount > HEARTBEAT_MAX_INTERVALS) {
      clearInterval(heartbeatInterval);
    }
  }, intervalLengthMs);
}

// Singleton to prevent startHeartbeatTracking from being called multiple times on client.
const initializeHeartbeatTracking = (function () {
  let isRunning = false;

  return function () {
    try {
      // @ts-ignore FIXME does not recognize global window
      if (typeof window !== 'undefined' && !DENYLISTED_APPS.includes(window?.appName || '') && !isRunning) {
        isRunning = true;
        startHeartbeatTracking(HEARTBEAT_INTERVAL_LENGTH);
      }
    } catch (e) {
      // do nothing
    }
  };
})();

export default initializeHeartbeatTracking;
