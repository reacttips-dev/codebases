'use es6';

import NewNotificationsNamespace from 'engagement-retention-experiments/namespaces/NewNotificationsNamespace';
import { hasGateSync } from './UserUtil';

function isWelcomeExperimentUngated() {
  return hasGateSync('Notifications:WelcomeExperiment');
}

export function isFaviconExperimentActive() {
  return !isWelcomeExperimentUngated() && NewNotificationsNamespace.get('newNotificationsFavicon') === 'true';
}