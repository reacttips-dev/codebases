// Imports
import coreContainer from '../coreContainer';

// Function Definitions

/**
 * Validates the data, and creates the marker.
 * A marker is essentially a span with the startTime predefined as the start of navigation.
 *
 * @param {Object} marker - The marker provided from the interface
 * @param {String} marker.name - A unique name given to identify the marker
 * @param {String} marker.domain - The domain under which the marker is to be grouped (used for querying).
 * @param {Number} marker.apdexThreshold - Time in ms used as the apdex threshold on the vendor (default is 250ms)
 */
function addMarker (marker) {
  return new Promise((resolve) => {
    try {

      if (window && window.SDK_PLATFORM === 'browser') {
        coreContainer.validateSpan(marker);
        coreContainer.addMarker(marker);
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
export default addMarker;
