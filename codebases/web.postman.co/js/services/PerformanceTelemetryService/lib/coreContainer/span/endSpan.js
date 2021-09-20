// Imports
import performanceEntry from '../performanceEntry';
import reporterContainer from '../../reporterContainer';
import Initialization from '../init';
import CONFIG from '../../../config/config';

// Constants
const IS_MARKER = false;

// Function Definitions

/**
 * Create the performance mark and measure for the end of the span
 *
 * @param {Object} span - The span provided from the interface
 * @param {String=} span.uid - If a uid was passed into the corresponding startSpan then the same uid needs to be passed in here.
 * @param {String} span.name - The event name given to identify the span when invoking startSpan.
 * @param {String} span.domain - The domain under which the span is to be grouped, same as passed into startSpan.
 */
function endSpan (span) {
  try {

    // Ensure TelemetryService is initialized
    if (!Initialization.isTelemetryServiceInitialized()) {
      throw new Error('TelemetryService - TelemetryService has not been initialized');
    }

    // Ensure that startSpan has been invoked before
    // This is done by making sure that a startSpan exists before creating an endSpan and a measure
    if (!performanceEntry.isStartSpanCreated(span)) {
      throw new Error('TelemetryService - EndSpan failed - Cannot find the corresponding startSpan for the endSpan.');
    }

    let startSpanPerformanceEntry = performanceEntry.getFirstPerformanceEntry(span, CONFIG.PERFORMANCE_ENTRY_TYPES.START);
    let startSpan = performanceEntry.getSpanFromPerformanceEntryName(startSpanPerformanceEntry.name);

    // We create a endSpan and then a measure with startSpan and endSpan as the start and end
    // This gives us a performanceEntry with startSpan and endSpan as the delimiters
    performanceEntry.createPerformanceMark(startSpan, CONFIG.PERFORMANCE_ENTRY_TYPES.END);
    performanceEntry.createPerformanceMeasure(startSpan, IS_MARKER);

    // Fetch the newly created performanceEntry and send it across to newrelic
    const performanceMeasure = performanceEntry.getFirstPerformanceEntry(startSpan, CONFIG.PERFORMANCE_ENTRY_TYPES.MEASURE);

    if (!performanceMeasure) {
      throw new Error('TelemetryService - EndSpan Failed - Cannot find the performanceEntry for the measure');
    }

    reporterContainer.reportToVendor(performanceMeasure);

    performanceEntry.clearPerformanceEntries(span);

  } catch (error) {
    throw error;
  }
}

// Exports
export default endSpan;
