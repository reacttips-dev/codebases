'use es6';

import Raven from 'Raven';
import CryptUtil from '../../util/CryptUtil';
import { debug } from '../../util/DebugUtil';
import { isSidebar } from '../../util/NotificationUtil';
import { setFaviconDot } from '../FaviconManager';
import NotificationManager from '../NotificationManager';
import UnreadNotificationCountManager from '../UnreadNotificationCountManager';
export function debugListener(data) {
  debug('RECEIVED REALTIME MESSAGE: ', data);
}
export function getReceivedNotificationListener(keys, onFailure) {
  return function (_ref) {
    var notification = _ref.data;
    var decryptedNotification;

    var _CryptUtil$splitEncry = CryptUtil.splitEncryptedToken(notification),
        encrypted = _CryptUtil$splitEncry.encrypted,
        timestamp = _CryptUtil$splitEncry.timestamp;

    var decryptKey = keys.find(function (key) {
      return key.timestamp === timestamp;
    });

    if (decryptKey) {
      try {
        var cryptUtil = new CryptUtil(decryptKey.key);
        decryptedNotification = cryptUtil.decryptToJSON(encrypted, decryptKey.key);
      } catch (error) {
        Raven.captureException('Failed to decrypt notification.', {
          extra: {
            error: error
          }
        });
      }
    } else {
      onFailure(notification);
      return;
    }

    if (isSidebar(decryptedNotification)) {
      UnreadNotificationCountManager.incrementUnreadNotificationsCount();
      setFaviconDot();
    }

    NotificationManager.showNotification(decryptedNotification);
  };
}