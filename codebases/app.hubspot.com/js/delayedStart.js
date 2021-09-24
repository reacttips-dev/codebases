'use es6';

import setup from 'engagement-retention-experiments/hublabsSetup';
import PortalIdParser from 'PortalIdParser';
import UsageTracker from './lib/usageTracker';
import BrowserNotificationManager from './manager/BrowserNotificationManager';
import { initCrossTabManager } from './manager/CrossTabManager';
import PersistentNotificationsManager from './manager/PersistentNotificationsManager';
import PresenceManager from './manager/PresenceManager';
import RealtimeManager from './manager/RealtimeManager';
import { addStylesToPage } from './manager/StyleManager';
import UnreadNotificationManager from './manager/UnreadNotificationManager';
import PostMessageManager from './manager/PostMessageManager';
import { TYPE_NOTIFICATIONS_READY } from './constants/PostMessageConstants';
export default function start() {
  var crossTab = initCrossTabManager();
  PostMessageManager.init();
  RealtimeManager.setup(crossTab);
  PresenceManager.startPing();
  PersistentNotificationsManager.setup();
  BrowserNotificationManager.start();
  addStylesToPage();
  UnreadNotificationManager.setup(crossTab);
  setup(PortalIdParser.get(), UsageTracker); // TODO: Make this call after all the other async setups have actually completed

  parent.postMessage(JSON.stringify({
    name: TYPE_NOTIFICATIONS_READY
  }), window.location.origin);
}