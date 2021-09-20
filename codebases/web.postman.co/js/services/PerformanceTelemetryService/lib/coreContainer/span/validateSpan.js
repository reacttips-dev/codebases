// Imports
import _ from 'lodash';
import Initialization from '../init';
import CONFIG from '../../../config/config';
import DOMAINS from '../../../config/domains';

// Function Definitions

/**
 * Validates the span data and then invokes endSpan from coreContainer
 *
 * @param {Object} span - The span provided from the interface
 */
const validateSpan = (span) => {

  // Ensure TelemetryService is initialized
  if (!Initialization.isTelemetryServiceInitialized()) {
    throw new Error('TelemetryService - TelemetryService has not been initialized');
  }

  // Ensure span is an object
  if (!_.isObject(span)) {
    throw new Error('TelemetryService - Invalid span provided');
  }

  // Ensure provided span has all necessary attributes to construct the performanceEntry
  const attributesInSpan = Object.keys(span);

  for (let attribute of CONFIG.SPAN_ATTRIBUTES) {
    if (!attributesInSpan.includes(attribute)) {
      throw new Error('TelemetryService - Span is missing essential attributes');
    }
  }

  // Ensure that if a threshold value is supplied then it's a valid apdex threshold
  if (span.hasOwnProperty('apdexThreshold') && !_.isNumber(span.apdexThreshold)) {
    throw new Error('TelemetryService - Span/Marker has been supplied an invalid apdex threshold');
  }

  const validCategories = Object.values(DOMAINS);

  if (!span.domain || !validCategories.includes(span.domain)) {
    throw new Error('TelemetryService - Span/Marker has been supplied an invalid domain');
  }

  return true;

};

// Exports
export default validateSpan;
