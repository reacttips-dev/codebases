'use es6'; // Wootric is our CSAT system for feedback. It's loaded in the global Navigation bar.
// Whether the survey shows or not is controlled by Wootric. (Surveys are only shown
// once, only on certain pages, and only if users have not been recently shown other
// surveys to avoid fatigue.)

export var triggerWootricsSurvey = function triggerWootricsSurvey() {
  try {
    // nav loads the wootric script async, so it may not be available immediately on page load
    if (window.wootric) {
      window.wootric('run');
    }
  } catch (e) {// Do nothing; wootric CSAT surveys are best-effort
  }
};