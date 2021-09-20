// Imports
import _ from 'lodash';
import CONFIG from '../../config/config';
import reporterContainer from '../reporterContainer';

// Function definitions

/**
 * Represents the initialization class.
 * Contains the client application information.
 */
function Init () { }

// Initialize clientInformation from the static config
Init.clientInformation = CONFIG.CLIENT_INFORMATION;

/**
 * Used to verify if telemetryService is initialized
 *
 * @returns {Boolean} True/False depending on if TelemetryService is initialized
 */
function isTelemetryServiceInitialized () {

  if (!Init.clientInformation) {
    return false;
  }

  for (let key of CONFIG.INITIALIZATION_ATTRIBUTES) {
    if (!Init.clientInformation[key]) {
      return false;
    }
  }

  return true;
}

/**
 * Used to initialize telemetry service by assigning the clientInformation to the static properties in Init
 *
 * @param {Object} clientInformation - Contains the applicationName, applicationVersion.
 * @param {String} clientInformation.applicationName - The name of the client application
 * @param {String} clientInformation.applicationVersion - The version of the client application
 * @param {Number=} clientInformation.harvestStart - The time after init at which the service should start sending metrics to vendor
 * @param {Number=} clientInformation.harvestInterval - The interval in which the service should send metrics to vendor
 * @param {Number=} clientInformation.rateLimit - The maximum number of events to be sent in a harvestInterval
 */
function initializeTelemetryService ({ applicationName, applicationVersion, harvestStart, harvestInterval, rateLimit }) {

  if (isTelemetryServiceInitialized()) {
    throw new Error('TelemetryService - Init Failed - TelemetryService is already initialized');
  }

  if (!_.isString(applicationName)) {
    throw new Error('TelemetryService - Init Failed - The supplied `Application Name` needs to be a string');
  }

  if (!_.isNumber(applicationVersion)) {
    throw new Error('TelemetryService - Init Failed - The supplied `Application Version` needs to be a number');
  }

  Init.clientInformation.applicationName = applicationName;
  Init.clientInformation.applicationVersion = applicationVersion;

  if ((harvestStart && _.isNumber(harvestStart)) || harvestStart === 0) {
    Init.harvestStart = harvestStart;
  }

  if (harvestInterval && _.isNumber(harvestInterval)) {
    Init.harvestInterval = harvestInterval;
  }

  if (rateLimit && _.isNumber(rateLimit)) {
    Init.rateLimit = rateLimit;
  }

  reporterContainer.initializeHarvester();
}

/**
 * Return the clientInformation from Init assuming TelemetryService has been initialized
 */
function getClientInformation () {

  if (!isTelemetryServiceInitialized()) {
    throw new Error('TelemetryService - Initialize the TelemetryService before fetching client information');
  }

  return Init.clientInformation;
}

// Exports
const Initialization = {
  initializeTelemetryService,
  isTelemetryServiceInitialized,
  getClientInformation
};

export default Initialization;
