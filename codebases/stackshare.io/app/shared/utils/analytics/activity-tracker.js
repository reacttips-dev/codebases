function throttle(callback, limit) {
  let wait = false;
  return function() {
    if (!wait) {
      callback.call();
      wait = true;
      setTimeout(function() {
        wait = false;
      }, limit);
    }
  };
}

const ActivityTracker = analytics => {
  let started = false;
  let stopped = false;
  let turnedOff = false;
  let clockTime = 0;
  let startTime = new Date();
  let clockTimer = null;
  let idleTimer = null;
  let reportInterval = 10;
  let idleTimeout = 30;

  // throttle callbacks for events (mousemove, scroll)
  // Set clock idle if user changes context (i.e. tabs)
  function visibilityChange() {
    if (document.hidden || document.webkitHidden) {
      setIdle();
    }
  }

  // Send event with time it took user to first interact with the page
  function sendUserTiming(timingValue) {
    analytics.track('activityTracker.firstInteraction', {
      category: 'Timing',
      label: 'First Interaction',
      value: timingValue
    });
  }

  // Send ping event to segment that user is still active
  function sendEvent(time) {
    analytics.track('activityTracker.timeSpent', {
      category: 'Timing',
      label: time,
      value: reportInterval
    });
  }

  // callback to handle activity events
  function trigger() {
    if (turnedOff) {
      return;
    }
    if (!started) {
      startActivityTracker();
    }
    if (stopped) {
      restartClock();
    }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(setIdle, idleTimeout * 1000 + 100);
  }

  // Set the clock to idle when context changes
  function setIdle() {
    clearTimeout(idleTimer);
    stopClock();
  }

  // Keep track of time spent interacting with the page
  function clock() {
    clockTime++;
    if (clockTime > 0 && clockTime % reportInterval === 0) {
      sendEvent(clockTime);
    }
  }

  function stopClock() {
    stopped = true;
    clearInterval(clockTimer);
  }

  function restartClock() {
    stopped = false;
    clearInterval(clockTimer);
    clockTimer = setInterval(clock, 1000);
  }

  function startActivityTracker() {
    // Calculate seconds from start to first interaction
    const currentTime = new Date();
    const diff = currentTime - startTime;
    // Set global
    started = true;
    // Send user timing event
    sendUserTiming(diff);
    // Start the clock
    clockTimer = setInterval(clock, 1000);
  }

  if (typeof document !== 'undefined') {
    // Activity event listeners
    document.addEventListener('keydown', trigger);
    document.addEventListener('click', trigger);
    document.addEventListener('mousemove', throttle(trigger, 500));
    document.addEventListener('scroll', throttle(trigger, 500));
    // Page visibility listeners
    document.addEventListener('visibilityChange', visibilityChange);
    document.addEventListener('webkitvisibilitychange', visibilityChange);
  }
};

export default ActivityTracker;
