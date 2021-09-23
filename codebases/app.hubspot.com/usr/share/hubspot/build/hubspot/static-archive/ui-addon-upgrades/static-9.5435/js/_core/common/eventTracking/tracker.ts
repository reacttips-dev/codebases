import { createTracker } from 'usage-tracker';
import { isApiBlackListed } from '../navigation/isApiBlackListed';
import events from 'ui-addon-upgrades/events.yaml';
var AMPLITUDE_APP_NAME = 'upgrades';
export var tracker = createTracker({
  events: events,
  properties: {
    namespace: AMPLITUDE_APP_NAME
  }
});

var _beaconTracker = tracker.clone({
  isBeforeUnload: true
});

var _transformEventProperties = function _transformEventProperties(eventProperties) {
  if (!eventProperties) return {};
  var notAssigned = 'Not assigned';
  var repInfo = eventProperties.repInfo;
  delete eventProperties.repInfo;
  eventProperties.repName = repInfo ? repInfo.name || notAssigned : notAssigned;
  return eventProperties;
};

export var track = function track(eventKey, eventProperties) {
  if (isApiBlackListed()) {
    return;
  }

  eventProperties = _transformEventProperties(eventProperties);
  tracker.track(eventKey, eventProperties);
}; // Uses beacon to ensure events get sent if tracking just before the page unloads
// https://product.hubteam.com/docs/usage-tracking-manual/docs/javascript/external-link-click-tracking.html

export var trackBeforeUnload = function trackBeforeUnload(eventKey, eventProperties) {
  if (isApiBlackListed()) {
    return;
  }

  eventProperties = _transformEventProperties(eventProperties);

  _beaconTracker.track(eventKey, eventProperties);
};