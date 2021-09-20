// Imports
import coreContainer from '../coreContainer';

// Function Definitions

/**
 * Captures the startTime of a spanObject. Corresponding endSpan needs to be invoked to end the span.
 *
 * @param {Object} span - The span provided from the interface
 * @param {String=} span.uid - Optional unique id that can be provided to ensure that the same span can be concurrently captured multiple times
 * @param {String} span.name - A event name given to identify the span
 * @param {String} span.domain - The domain under which the span is to be grouped (used for querying).
 * @param {Number=} span.apdexThreshold - Time in ms used as the apdex threshold on the vendor (default is 250ms)
 */
function startSpan (span) {
  return new Promise((resolve) => {
    try {

      if (window && window.SDK_PLATFORM === 'browser') {
        coreContainer.validateSpan(span);
        coreContainer.startSpan(span);
      }

      resolve();

    } catch (error) {
      // We do not want to bubble up this error
      // TelemetryService only logs the error and fails without breakage
      if (window.RELEASE_CHANNEL === 'dev') {
        pm.logger.warn(error);
      }
    }
  });
}

// Exports
export default startSpan;
