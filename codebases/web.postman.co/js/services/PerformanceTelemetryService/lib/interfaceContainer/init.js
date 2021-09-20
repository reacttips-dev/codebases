// Imports
import coreContainer from '../coreContainer';

// Function Definitions

/**
 * Invokes the initialization function from coreContainer
 *
 * @param {Object} applicationData - The client application name and version.
 * @param {String} applicationData.applicationName - The name of the client application invoking the init function
 * @param {Number} applicationData.applicationVersion - The version of the client application invoking the init function
 * @param {Number=} applicationData.harvestStart - The time after init at which the service should start sending metrics to vendor
 * @param {Number=} applicationData.harvestInterval - The interval in which the service should send metrics to vendor
 * @param {Number=} applicationData.rateLimit - The maximum number of events to be sent in a harvestInterval
 */
function init (applicationData) {
  try {
    if (window && window.SDK_PLATFORM === 'browser') {
      coreContainer.initialization.initializeTelemetryService(applicationData);
    }
  } catch (error) {
    console.log(error);
  }
}

// Exports
export default init;
