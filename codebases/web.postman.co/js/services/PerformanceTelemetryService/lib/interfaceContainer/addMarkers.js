// Imports
import coreContainer from '../coreContainer';

// Function Definitions

/**
 * Validates the data, and creates the marker.
 * A marker is used to annotate a specific point in the session.
 * Takes in an array of objects, each containing name/domain.
 * Each of the objects is used to annotate the same marker.
 * This is used when squads wish to reuse the marker/annotate the marker differently.
 *
 * @param {Array.<{name: String, domain: String, apdexThreshold: String}>} markers - Array of markers provided from the interface
 */
function addMarkers (markers) {
  return new Promise((resolve) => {
    try {

      if (!Array.isArray(markers)) {
        throw new Error('TelemetryService - addMarkers requires an array of objects');
      }

      if (window && window.SDK_PLATFORM === 'browser') {

        // Internally we need to create multiple markers to annotate the same point
        // This is to ensure that the vendor gets multiple data points and querying on the vendor/looker remains simple
        for (let marker of markers) {

          // Ensure that if any specific marker is invalid/errors out we still capture the rest of the markers.
          try {
            coreContainer.validateSpan(marker);
            coreContainer.addMarker(marker);
          } catch (error) {
            if (window.RELEASE_CHANNEL === 'dev') {
              pm.logger.warn(error);
            }
          }
        }
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
export default addMarkers;
