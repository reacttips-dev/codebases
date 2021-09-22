import { lazyGetNotificationEmitter, NotificationEventType } from 'owa-notification';
import { isFeatureEnabled } from 'owa-feature-flags';

import onChannelData from './handlers/onChannelData';
import onNotificationData from './handlers/onNotificationData';
import {
    onSubscriptionAdded,
    onSubscriptionUpdated,
    onSubscriptionRemoved,
} from './handlers/subscriptionEventHandlers';
import { onTraceWarning, onTraceError } from './handlers/onTrace';

// Initializes the handlers of various notification events for diagnostic datapoint collecion
// Bootstrap Note: be sure to call this before calling initializeNotification() to ensure all events are captured
export default async function initializeNotificationDiagnostics() {
    if (isFeatureEnabled('fwk-devTools')) {
        const getNotificationEmitter = await lazyGetNotificationEmitter.import();
        const emitter = getNotificationEmitter();

        emitter.on(NotificationEventType.ChannelData, onChannelData);
        emitter.on(NotificationEventType.NotificationData, onNotificationData);
        emitter.on(NotificationEventType.SubscriptionAdded, onSubscriptionAdded);
        emitter.on(NotificationEventType.SubscriptionRemoved, onSubscriptionRemoved);
        emitter.on(NotificationEventType.SubscriptionUpdated, onSubscriptionUpdated);
        emitter.on(NotificationEventType.TraceWarn, onTraceWarning);
        emitter.on(NotificationEventType.TraceError, onTraceError);
    }
}
