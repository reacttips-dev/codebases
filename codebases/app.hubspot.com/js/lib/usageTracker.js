'use es6';

import { createTracker } from 'usage-tracker';
import events from '../../events.yaml';
import { NOTIFICATIONS_APP, BROWSER_NOTIFICATIONS_APP } from '../constants/TrackingConstants';
export var BrowserNotificationsUsageTracker = createTracker({
  events: events,
  properties: {
    namespace: BROWSER_NOTIFICATIONS_APP
  }
});
var UsageTracker = createTracker({
  events: events,
  properties: {
    namespace: NOTIFICATIONS_APP
  },
  allowUnauthed: true
});
export default UsageTracker;