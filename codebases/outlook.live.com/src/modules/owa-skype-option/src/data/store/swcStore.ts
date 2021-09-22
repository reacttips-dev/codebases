import { SkypeNotificationOptions, OwsOptionsFeatureType } from 'owa-outlook-service-options';
import { createStore } from 'satcheljs';
import SkypeNotificationType from './schema/SkypeNotificationType';

export default createStore<SkypeNotificationOptions>('swcOptions', {
    skypeMessageNotification: SkypeNotificationType.None,
    skypeCallingNotification: SkypeNotificationType.None,
    feature: OwsOptionsFeatureType.SkypeNotifications,
});
