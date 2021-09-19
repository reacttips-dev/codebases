import ExecutionEnvironment from 'exenv';

// making global for now
if (ExecutionEnvironment.canUseDOM) {
  window.monetateQ = window.monetateQ || [];
}

export const sendMonetateEvent = function() {
  if (window.monetateQ) {
    // Send each argument as an event
    // Conversion to a "true" array instead of using a Symbol
    const eventData = Array.from(arguments);
    for (let i = 0; i < eventData.length; i++) {
      if (eventData[i]) {
        window.monetateQ.push(eventData[i]);
      }
    }

    // Tell Monetate to track
    window.monetateQ.push([
      'trackData'
    ]);
  }
};
