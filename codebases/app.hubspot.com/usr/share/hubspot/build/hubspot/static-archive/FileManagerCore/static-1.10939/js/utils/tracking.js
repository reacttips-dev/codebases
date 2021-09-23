'use es6'; // ensure we are passed a usage-tracker-js tracker

export function isCurrentUsageTracker(usageTracker) {
  return Boolean(usageTracker && !usageTracker.trackInteraction && usageTracker.config);
}
export function getUsageTrackerJsEventName(hublyticsEventName) {
  switch (hublyticsEventName) {
    case 'Manage Files':
      return 'fileManagerManageFiles';

    case 'Browse Shutterstock':
      return 'fileManagerBrowseShutterstock';

    case 'Accept Video TOS':
      return 'fileManagerAcceptVideoTOS';

    case 'Change image optimization setting':
      return 'fileManagerImageOptimization';

    case 'Alert interaction':
      return 'fileManagerAlert';

    default:
      return hublyticsEventName;
  }
}