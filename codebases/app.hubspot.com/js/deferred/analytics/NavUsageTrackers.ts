import createNavTrackingClient from './createNavTrackingClient';
import events from 'unified-navigation-ui/events.yaml';
var NavUsageTracker;
var NavLinkUsageTracker;

function setupNavUsageTrackers(userEmail) {
  var usageTrackingClient = createNavTrackingClient(userEmail); // For events that won't trigger a page unload

  NavUsageTracker = usageTrackingClient.createTracker({
    events: events,
    properties: {
      namespace: 'nav-v4'
    },
    onError: function onError(err) {
      throw err;
    },
    bypassPool: false
  }); // For events that will trigger a page unload

  NavLinkUsageTracker = NavUsageTracker.clone({
    isBeforeUnload: true,
    bypassPool: false
  });
}

function getNavUsageTracker() {
  return NavUsageTracker;
}

function getNavLinkUsageTracker() {
  return NavLinkUsageTracker;
}

export { setupNavUsageTrackers, getNavUsageTracker, getNavLinkUsageTracker };