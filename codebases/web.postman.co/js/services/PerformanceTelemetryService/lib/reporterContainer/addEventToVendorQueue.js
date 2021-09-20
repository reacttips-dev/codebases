// Imports
import reportToNewRelic from './newrelicReporter';

// Function Definitions

/**
 * Interface function for the vendor which enqueues events for harvesting
 *
 * @param {Object} performanceMeasure - The performanceEntry of the measure that encompasses the startSpan and endSpan
 */
function addEventToVendorQueue (performanceMeasure) {
  reportToNewRelic(performanceMeasure);
}

// Exports
export default addEventToVendorQueue;
