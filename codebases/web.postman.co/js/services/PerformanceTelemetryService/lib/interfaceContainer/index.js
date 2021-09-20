// Imports
import init from './init';
import addMarker from './addMarker';
import addMarkers from './addMarkers';
import startSpan from './startSpan';
import endSpan from './endSpan';
import DOMAINS from './domains';

// Exports
const interfaceContainer = {
  init,
  startSpan,
  endSpan,
  addMarker,
  addMarkers,
  DOMAINS
};

export default interfaceContainer;
