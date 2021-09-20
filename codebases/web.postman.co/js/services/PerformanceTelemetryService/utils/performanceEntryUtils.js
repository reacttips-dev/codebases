// Imports
import coreContainer from '../lib/coreContainer';

// Function Definitions

/**
 * Helper function used to generate a human readable object from the performance measure
 *
 * @param {Object} performanceMeasure - The performanceEntry of the measure being added to the queue
 */
function createPerformanceLogObject (performanceMeasure) {
  const { name, startTime, duration } = performanceMeasure;
  const measureType = getPerformanceMeasureEventType(performanceMeasure);
  const span = coreContainer.getSpanFromPerformanceEntryName(name);

  switch (measureType) {
    case 'marker':
      return {
        name: span.name,
        domain: span.domain,
        type: measureType,
        timestamp: duration
      };
    case 'span':
    default:
      return {
        name: span.name,
        domain: span.domain,
        type: measureType,
        startTime: startTime,
        endTime: startTime + duration,
        duration: duration
      };
  }
}

/**
 * Helper function used to get the event type (span/marker) from the performance measure
 *
 * @param {Object} performanceMeasure - The performanceEntry of the measure being added to the queue
 */
function getPerformanceMeasureEventType (performanceMeasure) {
  const { startTime } = performanceMeasure;
  return startTime === 0 ? 'marker' : 'span';
}

// Exports
const performanceMeasureUtils = {
  createPerformanceLogObject,
  getPerformanceMeasureEventType
};

export default performanceMeasureUtils;
