'use es6';

import CrossTab from 'crosstab';
import { MESSAGE_CLOSED_EVENT, RESET_COUNTER_EVENT } from '../constants/Events';
import { debug } from '../util/DebugUtil';
import { getCurrentPortalId } from '../util/PortalUtil';
import { isInApp } from '../util/NotificationUtil';
import NotificationManager from './NotificationManager';
import UnreadNotificationManager from './UnreadNotificationManager';
var crossTab;

function handleBecomeMaster() {
  NotificationManager.setIsMaster(true); // The browser will block sounds if the tab is not visible when the first
  // sound attempts to play, so try to play a muted sound when the tab becomes
  // master - this is forced every time the tab is focused

  if (!NotificationManager.getCanPlaySounds()) {
    NotificationManager.getPlaySoundFunction({
      isDummySound: true
    })();
  }
}

function handleRemoved() {
  NotificationManager.setIsMaster(false);
}

function handleSurrenderMaster() {
  NotificationManager.setIsMaster(false);
}

function handleMessage(_ref) {
  var message = _ref.message;

  if (message.type) {
    switch (message.type) {
      case MESSAGE_CLOSED_EVENT:
        NotificationManager.notificationClosed(message.id);
        break;

      case RESET_COUNTER_EVENT:
        UnreadNotificationManager.resetCounter();
        break;

      default:
        debug('The received message type is unknown:', message.type);
    }
  }
}

export function initCrossTabManager() {
  var CROSS_TAB_NAMESPACE = "NOTIFICATIONS_" + getCurrentPortalId();
  crossTab = new CrossTab(CROSS_TAB_NAMESPACE, {
    onBecomeMaster: handleBecomeMaster,
    onSurrenderMaster: handleSurrenderMaster,
    onMessage: handleMessage,
    onRemoved: handleRemoved
  });
  NotificationManager.onClose(function (notification) {
    if (isInApp(notification)) {
      crossTab.dispatchMessage({
        id: notification.id,
        type: MESSAGE_CLOSED_EVENT
      });
    }
  });
  return crossTab;
}