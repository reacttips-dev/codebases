// Imports
import _ from 'lodash';
import CONFIG from '../../config/config';

// Function definitions

/**
 * Create the performanceEntry prefix, with the span and type that is prepended to the entry name.
 * This prefix is deemed unique and we can have only one active performanceEntry with a unique prefix at a time.
 *
 * @param {Object} span - The span provided from the interface.
 * @param {String} type - Used to understand the type of the span (start/end/measure).
 */
function createPerformanceEntryNamePrefix (span, type) {
  let performanceEntryNamePrefix = `TelemetryService-v1::${span.uid || ''}::${span.name}::${span.domain}::${type}`;

  return performanceEntryNamePrefix;
}

/**
 * Create the performanceEntry name, this is a combination of all the span properties supplied
 *
 * @param {Object} span - The span provided from the interface.
 * @param {String} type - Used to understand the type of the span (start/end/measure).
 */
function createPerformanceEntryName (span, type) {
  let performanceEntryName = `${createPerformanceEntryNamePrefix(span, type)}::${span.apdexThreshold || CONFIG.DEFAULT_APDEX_THRESHOLD}`;
  return performanceEntryName;
}

/**
 * Retrieve the span properties from the name
 *
 * @param {Object} entryName - The name supplied when creating the performance entry.
 */
function getSpanFromPerformanceEntryName (entryName) {
  const [serviceName, uid, name, domain, type, apdexThreshold] = entryName.split('::');

  return {
    serviceName,
    uid,
    name,
    domain,
    type,
    apdexThreshold
  };
}

/**
 * Fetches the first performance entry found based on provided span or type
 *
 * @param {Object} span - The span supplied into startSpan/endSpan.
 * @param {String} type - The type of the performanceEntry generated.
 */
function getFirstPerformanceEntry (span, type) {

  // Search by the exact performanceEntry name
  let performanceEntries = getPerformanceEntries(span, type);

  // If not found then return null
  if (!performanceEntries || !performanceEntries.length) {
    return null;
  }

  // If we find multiple performance entries then return the first one found. This ideally should never happen.
  return performanceEntries[0];
}

/**
 * Fetches the performance entries found based on provided span or type
 *
 * @param {Object} span - The span supplied into startSpan/endSpan.
 * @param {String} type - The type of the performanceEntry generated.
 */
function getPerformanceEntries (span, type) {

  if (!window || !window.performance || !window.performance.getEntries) {
    throw new Error('TelemetryService - performance.getEntries is not available in this browser');
  }

  // Search by the exact performanceEntry name
  let performanceEntries = window.performance.getEntries().filter((entry) => {
    let performanceEntryPrefix = createPerformanceEntryNamePrefix(span, type);
    return entry.name.startsWith(performanceEntryPrefix);
  });

  // If not found then return null
  if (!performanceEntries || !performanceEntries.length) {
    return [];
  }

  return performanceEntries;
}

/**
 * Create a performance.mark based on the given span and type
 *
 * @param {Object} span - The span provided from the interface.
 * @param {String} type - Used to understand the type of the span (start/end/measure).
 */
function createPerformanceMark (span, type) {

  if (!window || !window.performance || !window.performance.mark) {
    throw new Error('TelemetryService - performance.mark is not available in this browser');
  }

  if (!type) {
    throw new Error('TelemetryService - A valid type is needed to create a performance mark');
  }

  let VALID_TYPES = Object.values(CONFIG.PERFORMANCE_ENTRY_TYPES);

  if (!_.includes(VALID_TYPES, type)) {
    throw new Error('TelemetryService - An invalid type is supplied to create a performance mark');
  }

  const performanceMarkName = createPerformanceEntryName(span, type);
  window.performance.mark(performanceMarkName);

}

/**
 * Ensures a performance.mark of the type start exists for the given span
 *
 * @param {Object} span - The span that startSpan is supplied with.
 * @returns {Boolean} - True/False based on if the startSpan performance mark is created
 */
function isStartSpanCreated (span) {

  const performanceMark = getFirstPerformanceEntry(span, CONFIG.PERFORMANCE_ENTRY_TYPES.START);

  if (!performanceMark) {
    return false;
  }

  return true;
}

/**
 * Create a performanceEntry of type measure for the give span
 *
 * @param {Object} span - The span provided from the interface.
 * @param {Boolean} isMarker - Boolean indicating whether the measure is for a marker.
 * For a marker the startSpan (startTime) is fixed at navigationStart.
 */
function createPerformanceMeasure (span, isMarker) {
  try {

    if (!window || !window.performance || !window.performance.measure) {
      throw new Error('TelemetryService - performance.measure is not available in this browser');
    }

    let performanceMarkStartName = null;

    if (!isMarker) {
      /* Fetch the performanceEntry by searching and filtering by a prefix instead of
       searching by name. This is because the uid is optional and if uid
       is not provided then we need to filter by the other properties */
      const performanceMarkStart = getFirstPerformanceEntry(span, CONFIG.PERFORMANCE_ENTRY_TYPES.START);

      if (!performanceMarkStart) {
        throw new Error('TelemetryService - endSpan failed - performance.mark for startSpan not found');
      }

      performanceMarkStartName = performanceMarkStart.name;
    }

    // We follow the same process for the endSpan performanceEntry too
    const performanceMarkEnd = getFirstPerformanceEntry(span, CONFIG.PERFORMANCE_ENTRY_TYPES.END);

    if (!performanceMarkEnd) {
      throw new Error('TelemetryService - endSpan failed - performance.mark for endSpan not found');
    }

    // eslint-disable-next-line one-var
    const performanceMarkEndName = performanceMarkEnd.name,
      performanceMeasureName = createPerformanceEntryName(span, CONFIG.PERFORMANCE_ENTRY_TYPES.MEASURE);

    window.performance.measure(performanceMeasureName, performanceMarkStartName, performanceMarkEndName);

  } catch (error) {
    throw error;
  }
}

/**
 * Clears performanceEntries for a specific span.
 *
 * @param {Object} span - The span provided from the interface.
 */
function clearPerformanceEntries (span) {
  try {

    if (!window || !window.performance || !window.performance.getEntries) {
      throw new Error('TelemetryService - performance.getEntries is not available in this browser');
    }

    let startPerformanceMarks = getPerformanceEntries(span, CONFIG.PERFORMANCE_ENTRY_TYPES.START);
    let endPerformanceMarks = getPerformanceEntries(span, CONFIG.PERFORMANCE_ENTRY_TYPES.END);
    let performanceMeasures = getPerformanceEntries(span, CONFIG.PERFORMANCE_ENTRY_TYPES.MEASURE);

    let performanceMarks = [].concat(startPerformanceMarks, endPerformanceMarks);

    for (let mark of performanceMarks) {
      window.performance.clearMarks(mark.name);
    }

    for (let measure of performanceMeasures) {
      window.performance.clearMeasures(measure.name);
    }

  } catch (error) {
    throw error;
  }
}

// Exports
const performanceEntry = {
  createPerformanceMark,
  isStartSpanCreated,
  getSpanFromPerformanceEntryName,
  createPerformanceMeasure,
  getFirstPerformanceEntry,
  clearPerformanceEntries
};

export default performanceEntry;
