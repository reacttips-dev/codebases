// Imports
import initialization from './init';
import addMarker from './addMarker';
import validateSpan from './span/validateSpan';
import startSpan from './span/startSpan';
import endSpan from './span/endSpan';
import performanceEntry from './performanceEntry';

// Exports
const coreContainer = {
  initialization,
  addMarker,
  validateSpan,
  startSpan,
  endSpan,
  getSpanFromPerformanceEntryName: performanceEntry.getSpanFromPerformanceEntryName
};

export default coreContainer;
