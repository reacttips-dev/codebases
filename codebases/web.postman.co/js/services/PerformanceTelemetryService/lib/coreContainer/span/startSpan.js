// Imports
import { v4 as uuidv4 } from 'uuid';

import performanceEntry from '../performanceEntry';
import CONFIG from '../../../config/config';

// Function Definitions

/**
 * Creates the performance.mark for the start of the span
 *
 * @param {Object} span - The span provided from the interface.
 * @param {String=} span.uid - Optional unique id that can be provided to ensure that the same span can be concurrently captured multiple times
 * @param {String} span.name - A unique name given to identify the span
 * @param {String} span.domain - The domain under which the span is to be grouped (used for querying).
 * @param {Number=} span.apdexThreshold - Time in ms used as the apdex threshold on the vendor (default is 250ms)
 */
function startSpan (span) {
  try {
    if (performanceEntry.isStartSpanCreated(span)) {
      throw new Error('TelemetryService - There already exists a span that hasn\'t ended with this combination of name/domain/uid');
    }
    performanceEntry.createPerformanceMark(span, CONFIG.PERFORMANCE_ENTRY_TYPES.START);
  } catch (error) {
    throw error;
  }
}

// Exports
export default startSpan;
