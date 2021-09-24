'use es6';

import I18n from 'I18n';
import { isCurrentUsageTracker } from 'FileManagerCore/utils/tracking';
export function millisecondsToTimer(milliseconds) {
  if (!milliseconds) {
    return null;
  }

  if (milliseconds < 3600000) {
    return I18n.moment.utc(milliseconds).format('mm:ss');
  }

  return I18n.moment.utc(milliseconds).format('HH:mm:ss');
}

function getUsageTrackerOverwriteProperties(usageTracker) {
  return {
    properties: {
      namespace: 'file-picker',
      'in-app': usageTracker.config.properties ? usageTracker.config.properties.namespace : 'unknown',
      screen: 'picker'
    }
  };
}

export function getUsageTrackerWithNamespaceMaybeUpdated(usageTracker) {
  return isCurrentUsageTracker(usageTracker) ? usageTracker.clone(getUsageTrackerOverwriteProperties(usageTracker)) : usageTracker;
}