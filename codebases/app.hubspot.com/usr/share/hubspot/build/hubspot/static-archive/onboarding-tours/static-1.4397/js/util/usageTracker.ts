import { createTracker } from 'usage-tracker';
import events from 'onboarding-tours/events.yaml';
import { APP } from '../constants/TrackingConstants';
export var UsageTracker = createTracker({
  events: events,
  properties: {
    namespace: APP
  },
  onError: function onError() {// TODO: Add error handling
  }
});
export var ExternalLinkUsageTracker = UsageTracker.clone({
  isBeforeUnload: true
});