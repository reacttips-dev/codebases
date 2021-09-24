'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { createTracker } from 'usage-tracker';
import events from 'sales-modal/events.yaml';
import { TEMPLATES, DOCUMENTS, SEQUENCES } from 'sales-modal/constants/SalesModalSearchContentTypes';
var usageTracker;
export var initTracker = function initTracker() {
  usageTracker = createTracker({
    events: events,
    properties: {
      namespace: 'sequences'
    }
  });
};
export var UsageTracker = {
  track: function track(eventName, eventProps) {
    if (usageTracker) {
      usageTracker.track(eventName, eventProps);
    }
  }
};
export function trackSalesModalIndexInteraction(contentType, action) {
  var _event;

  var event = (_event = {}, _defineProperty(_event, TEMPLATES, 'salesModalTemplatesInteraction'), _defineProperty(_event, SEQUENCES, 'salesModalSequencesInteraction'), _defineProperty(_event, DOCUMENTS, 'salesModalDocumentsInteraction'), _event);
  UsageTracker.track(event[contentType], {
    action: action
  });
}