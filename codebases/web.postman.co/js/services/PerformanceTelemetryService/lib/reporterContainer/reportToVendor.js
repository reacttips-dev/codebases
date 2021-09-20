// Imports
import eventQueue from './eventQueue';
import performanceMeasureUtils from '../../utils/performanceEntryUtils';

// Function Definitions

/**
 * Interface function which enqueues events for harvesting
 *
 * @param {Object} performanceMeasure - The performanceEntry of the measure that encompasses the startSpan and endSpan
 */
function reportToVendor (performanceMeasure) {
  if (window.RELEASE_CHANNEL === 'dev') {
    const performanceLogObject = performanceMeasureUtils.createPerformanceLogObject(performanceMeasure);
    console.log(`TelemetryService - Created ${performanceLogObject.type}`, performanceLogObject);
  }
  eventQueue.enqueue(performanceMeasure);
}

// Exports
export default reportToVendor;
