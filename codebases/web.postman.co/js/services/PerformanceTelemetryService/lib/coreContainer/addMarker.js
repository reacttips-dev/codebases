// Imports
import { v4 as uuidv4 } from 'uuid';

import performanceEntry from './performanceEntry';
import reporterContainer from '../reporterContainer';
import CONFIG from '../../config/config';

// Constants
const IS_MARKER = true;

// Function Definitions

/**
 * Create the performance mark and measure for the end of the span
 *
 * @param {Object} span - The span provided from the interface
 */
function addMarker (span) {
  try {

    span.uid = uuidv4();

    // We create a endspan and then a measure with startSpan and endSpan as the start and end
    // Since the startspan doesn't exist performance API uses navigationStart as the startTime
    // This gives us a performanceEntry with startSpan and endSpan as the delimiters
    performanceEntry.createPerformanceMark(span, CONFIG.PERFORMANCE_ENTRY_TYPES.END);
    performanceEntry.createPerformanceMeasure(span, IS_MARKER);

    // Fetch the newly created performanceEntry and send it across to newrelic
    const performanceMeasure = performanceEntry.getFirstPerformanceEntry(span, CONFIG.PERFORMANCE_ENTRY_TYPES.MEASURE);

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
export default addMarker;
