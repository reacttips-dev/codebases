// Imports
import coreContainer from '../coreContainer';
import CONFIG from '../../config/config';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

// Function definitions

/**
 * Transform the performanceEntry into a format that newrelic can consume
 *
 * @param {Object} performanceEntry - The performanceEntry of the measure that encompasses the startSpan and endSpan
 * @returns {Object} - The newrelic span object with transformed data conforming to newrelic standards
 */
function transformSpanForNewrelic (performanceEntry) {
  try {
    const { name, startTime, duration } = performanceEntry;

    if (!name || (!startTime && startTime !== 0) || !duration) {
      throw new Error('TelemetryService - Invalid performanceEntry ingested for transformation');
    }

    const span = coreContainer.getSpanFromPerformanceEntryName(name);

    if (!span.name || !span.domain) {
      throw new Error('TelemetryService - Required properties (name, domain) not found in performanceEntry');
    }

    const clientInformation = coreContainer.initialization.getClientInformation(),
      newrelicSpan = {
        id: uuidv4(),
        uid: span.uid || null,
        name: span.name,
        domain: span.domain,
        startTime: startTime,
        endTime: startTime + duration,
        duration: duration,
        applicationName: clientInformation.applicationName,
        applicationVersion: clientInformation.applicationVersion,
        apdex_t: span.apdexThreshold || CONFIG.DEFAULT_APDEX_THRESHOLD
      };

    return newrelicSpan;
  } catch (error) {
    throw error;
  }
}

/**
 * Convert each attribute in the newrelicSpan to the appropriate data type as defined in the model
 *
 * @param {Object} newrelicSpan - The span to be sent to newrelic
 * @returns {Object} - The newrelic span object with transformed data conforming to newrelic model
 */
function convertNewrelicSpanAttributesToAppropriateDataType (newrelicSpan) {
  try {
    validateNewrelicSpan(newrelicSpan);

    const convertToString = (elem) => String(elem);
    const convertToNumber = (elem) => Number(elem);

    for (let key in newrelicSpan) {

      if (newrelicSpan[key] === null || newrelicSpan[key] === undefined) {
        delete newrelicSpan[key];
        continue;
      }

      let conversionFunction = null;

      switch (CONFIG.NEWRELIC_SPAN_DATA_MODEL[key]) {
        case 'number':
          conversionFunction = convertToNumber;
          break;
        case 'string':
        default:
          conversionFunction = convertToString;
          break;
      }

      newrelicSpan[key] = conversionFunction(newrelicSpan[key]);
    }

    return newrelicSpan;
  } catch (error) {
    throw error;
  }
}

/**
 * Validate the newrelic span object to ensure that the generated span has all necessary properties
 *
 * @param {Object} span - Contains the newrelic span generated in transformSpanForNewRelic
 */
function validateNewrelicSpan (span) {

  // Ensure span is an object
  if (!_.isObject(span)) {
    throw new Error('TelemetryService - Invalid span provided');
  }

  // Ensure provided span has all necessary attributes to construct the performanceEntry
  const attributesInSpan = Object.keys(span);

  for (let attribute of CONFIG.NEWRELIC_SPAN_ATTRIBUTES) {
    if (!attributesInSpan.includes(attribute)) {
      throw new Error('TelemetryService - Newrelic span is missing essential attributes');
    }
  }

}

/**
 * Send the data across in a XHR call to newrelic for data capture
 *
 * @param {Object} span - Contains the newrelic span generated in transformSpanForNewRelic
 */
function sendDataToNewrelic (span) {
  try {
    // eslint-disable-next-line no-undef
    if (!newrelic || !newrelic.interaction) {
      throw new Error('TelemetryService - Newrelic is not initialized');
    }

    const pageActionAttributes = {};

    for (let attribute of CONFIG.NEWRELIC_SPAN_ATTRIBUTES) {
      if (span.hasOwnProperty(attribute)) {
        pageActionAttributes[`pm_${attribute}`] = span[attribute];
      }
    }

    // eslint-disable-next-line no-undef
    newrelic.addPageAction(`${span.name}`, pageActionAttributes);

  } catch (error) {
    throw error;
  }
}

/**
 * Interface function which transforms, validates and sends data to new relic
 *
 * @param {Object} performanceMeasure - The performanceEntry of the measure that encompasses the startSpan and endSpan
 */
function reportToNewRelic (performanceMeasure) {
  try {
    let newrelicSpan = transformSpanForNewrelic(performanceMeasure);
    newrelicSpan = convertNewrelicSpanAttributesToAppropriateDataType(newrelicSpan);
    sendDataToNewrelic(newrelicSpan);
  } catch (error) {
    throw error;
  }
}

// Exports
export default reportToNewRelic;
