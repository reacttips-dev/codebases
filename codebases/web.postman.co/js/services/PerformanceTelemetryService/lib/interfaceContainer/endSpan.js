// Imports
import coreContainer from '../coreContainer';

// Function Definitions

/**
 * Captures the endTime of a span object. Pass in the same uid/name/domain supplied to startSpan.
 *
 * @param {Object} span - The span provided from the interface
 * @param {String=} span.uid - If a uid was passed into the corresponding startSpan then the same uid needs to be passed in here.
 * @param {String} span.name - The event name given to identify the span when invoking startSpan.
 * @param {String} span.domain - The domain under which the span is to be grouped, same as passed into startSpan.
 */
function endSpan (span) {
  return new Promise((resolve) => {
    try {
      if (window && window.SDK_PLATFORM === 'browser') {
        coreContainer.endSpan(span);
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
export default endSpan;
