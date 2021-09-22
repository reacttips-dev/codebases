import { mergeAllOverlappingDateRanges } from './mergeAllOverlappingDateRanges';
import { calendarEventsRemoved } from '../actions/publicActions';
import {
    filterCalendarEvents,
    getCalendarEventWithInstanceKey,
} from '../selectors/calendarFolderEventsSelectors';
import type CalendarItemNotificationPayloadExtended from '../store/schema/CalendarItemNotificationPayloadExtended';
import { logUsage } from 'owa-analytics';
import {
    getCalendarEntryByFolderId,
    getMailboxInfoFromCalendarFolderId,
    joinFolderIdAndChannelId,
    getSubscriptionFolderIdAndMailboxDetails,
} from 'owa-calendar-cache';
import { isException, isOccurrence, isRecurringMaster } from 'owa-calendar-event-capabilities';
import { calendarEvent } from 'owa-calendar-event-converter';
import expandCalendarEventService from '../services/expandCalendarEventService';
import { logNotificationUpdateForDiagnosticsAsync } from 'owa-calendar-notification-diagnostics';
import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import type { MailboxInfo } from 'owa-client-ids';
import { isCalendarEventLocalLie } from 'owa-calendar-event-local-lie';
import { areDateRangesEqual, DateRange, dateRangesOverlap } from 'owa-datetime-utils';
import { isFeatureEnabled } from 'owa-feature-flags';
import CalendarFolderTypeEnum from 'owa-service/lib/contract/CalendarFolderTypeEnum';
import type CalendarItem from 'owa-service/lib/contract/CalendarItem';
import type CalendarItemNotificationPayload from 'owa-service/lib/contract/CalendarItemNotificationPayload';
import type ExpandCalendarEventResponse from 'owa-service/lib/contract/ExpandCalendarEventResponse';
import type SubscriptionParameters from 'owa-service/lib/contract/SubscriptionParameters';
import {
    addCalendarEventsWithinCurrentLockedDateRanges,
    updateFullCalendarEventFromServer,
    removeCalendarEventWithInstanceKeyFromEventsCache,
    removeCalendarEventsFromEventsCacheMatchingFilter,
} from '../actions/eventsCacheActions';
import {
    lazyGetChannelId,
    lazySubscribe,
    lazyUnsubscribe,
    NotificationSubscription,
} from 'owa-notification';
import { addOrModifyItemInCache, reloadItemsCache } from './SharedCacheFunctions';
import {
    getAllLockedDateRanges,
    getAllLockedEvents,
    isEventsCacheInitialized,
} from '../selectors/eventsCacheSelectors';
import { setupAutoReload } from './setupAutoReload';

/**
 * Constants for the notification types we process
 */
const NotificationTypeConstants = {
    RowAdded: 'RowAdded',
    RowModified: 'RowModified',
    RowDeleted: 'RowDeleted',
    Reload: 'Reload',
};

/**
 * How long we'll wait to process notifications after they arrive
 */
const ProcessNotificationAfterMilliseconds = 2 * 1000;

/**
 * Subscription data for a given calendar
 */
interface SubscriptionData {
    folderId: string;
    subscription: NotificationSubscription;
    locks: { [lockId: string]: boolean };
}

/**
 * Subscriptions map with key = folderId and value = SubscriptionData for that calendar folder
 */
let subscriptions: { [folderId: string]: SubscriptionData } = {};

/**
 * instanceKeyToUid stores a mapping between instance keys and UIDs of the notifications in the queue.
 */
let instanceKeyToUid: { [InstanceKey: string]: string } = {};

/**
 * A queue that stores incoming notifications (export should *only* be used by unit tests)
 */
export let notificationsQueue: CalendarItemNotificationPayloadExtended[] = [];

/**
 * The timer that we use to delay the processing of notifications
 */
let notificationQueueTimer: NodeJS.Timer;

/**
 * Whether or not we should process incoming notifications immediately or leave
 * them in the queue to be processed later.
 */
let processNotifications: boolean = true;
let isFirstSubscription: boolean = true;

/**
 * Subscribe to receive calendar item notifications for the given calendar folder
 * @param folderId The calendar folder id
 */
export function subscribeNotifications(folderId: string, lockId: string) {
    if (isFirstSubscription) {
        setupAutoReload();
        isFirstSubscription = false;
    }
    if (subscriptions[folderId]) {
        subscriptions[folderId].locks[lockId] = true;
        // We are already subscribed to this folder, log it and exit
        logNotificationUpdateForDiagnosticsAsync({
            message: 'Already subscribed to calendar item notifications for folder',
            folderId: folderId,
        });
        return;
    }

    const calendarEntry = getCalendarEntryByFolderId(folderId);
    if (!calendarEntry) {
        logNotificationUpdateForDiagnosticsAsync({
            message: 'Calendar entry not found to subscribe to notifications for folder',
            folderId: folderId,
        });
        return;
    }

    const folderAndMailboxId = getSubscriptionFolderIdAndMailboxDetails(calendarEntry);
    if (folderAndMailboxId) {
        const includeDeclinedMeetings = isFeatureEnabled('cal-surface-declinedMeetings');

        lazyGetChannelId.import().then(getChannelId => {
            const subscriptionParameters: SubscriptionParameters = {
                ...folderAndMailboxId,
                ChannelId: getChannelId(),
                NotificationType: 'CalendarItemNotification',
                IncludeDeclinedMeetings: includeDeclinedMeetings,
            };

            // subscription ID needs to be different when requesting for declined meetings or it won't update in the server
            const subscriptionId =
                `${subscriptionParameters.NotificationType}${folderId}` +
                (includeDeclinedMeetings ? 'declinedMeetings' : '');

            const subscription: NotificationSubscription = {
                subscriptionId: subscriptionId,
                requiresExplicitSubscribe: true,
                subscriptionParameters: subscriptionParameters,
            };

            const subscriptionData: SubscriptionData = {
                folderId: folderId,
                subscription: subscription,
                locks: { [lockId]: true },
            };

            logNotificationUpdateForDiagnosticsAsync({
                message: `Subscribing to calendar item notifications for folder with includeDeclinedMeetings = ${includeDeclinedMeetings}`,
                folderId: folderId,
            });
            lazySubscribe.importAndExecute(subscription, handleNotification);

            subscriptions[folderId] = subscriptionData;
        });
    }
}

/**
 * Unsubscribe from calendar item notifications for the given calendar folder
 * This removes the subscription for ALL locks, so it should only be called if a
 * calendar is being removed or deleted.
 * @param folderId The calendar folder id
 * */
export function unsubscribeNotifications(folderId: string) {
    const subscriptionData = subscriptions[folderId];

    if (subscriptionData) {
        logNotificationUpdateForDiagnosticsAsync({
            message: 'Unsubscribing from calendar item notifications for folder',
            folderId: folderId,
        });
        lazyUnsubscribe.importAndExecute(subscriptionData.subscription, handleNotification);
        delete subscriptions[folderId];
    } else {
        logNotificationUpdateForDiagnosticsAsync({
            message:
                'Could not unsubscribe calendar item notifications for folder due to subscription data not found',
            folderId: folderId,
        });
    }
}

/**
 * Remove the locks subscriptions to calendar item notifications.
 * If no other locks subscribe to calendar item notifications for the given calendar folder, unsubscribe.
 * @param lockId The lockId to remove the subscription
 * */
export function unsubscribeNotificationsForLock(lockId: string) {
    Object.keys(subscriptions).forEach(folderId => {
        const { locks, subscription } = subscriptions[folderId];
        if (locks[lockId]) {
            delete locks[lockId];
            // if no other locks need the subscription, unsubscribe
            if (Object.keys(locks).length === 0) {
                logNotificationUpdateForDiagnosticsAsync({
                    message: 'Unsubscribing from calendar item notifications for folder',
                    folderId: folderId,
                });
                lazyUnsubscribe.importAndExecute(subscription, handleNotification);
                delete subscriptions[folderId];
            }
        }
    });
}

/**
 * Gets subscription data for a given calendar folder (should *only* be used by unit tests)
 * @param folderId The calendar folder id
 * @returns The subscription data
 */
export function getSubscriptionData(folderId: string): SubscriptionData {
    return subscriptions?.[folderId] ? subscriptions[folderId] : null;
}

/**
 * Handles a notification (export should *only* be used by unit tests)
 * @param notification The notification
 */
export function handleNotification(notification: CalendarItemNotificationPayload) {
    traceNotificationData(notification, true);
    let extendedNotification: CalendarItemNotificationPayloadExtended = {
        NotificationPayload: notification,
        InstanceKeyToDelete: null,
        OriginalUID: null,
    };

    // We can receive multiple notifications for the same item in a short period of time. If we process them
    // in succession, we can get flickering. The solution is to add them to a queue and delay the processing.
    // When a notification is enqueued, we'll remove previous notifications for the same item and will only
    // process the most recent one.
    enqueueNotification(extendedNotification);

    if (processNotifications) {
        if (notificationQueueTimer) {
            logNotificationUpdateForDiagnosticsAsync({
                message:
                    'Notification processing timer was already started. It will be cancelled and restarted.',
            });
            clearTimeout(notificationQueueTimer);
        }

        notificationQueueTimer = setTimeout(
            drainNotificationQueue,
            ProcessNotificationAfterMilliseconds
        );

        logNotificationUpdateForDiagnosticsAsync({
            message: 'Timer to drain queue has started',
        });
    } else {
        logNotificationUpdateForDiagnosticsAsync({
            message: 'The notification was received while notification processing was suspended',
        });
    }
}

/**
 * Handles a notification (export should *only* be used by unit tests)
 * @param notification The notification
 */
export function handleNotificationInternal(notification: CalendarItemNotificationPayloadExtended) {
    traceNotificationData(notification.NotificationPayload, false);

    if (isReloadNotification(notification.NotificationPayload)) {
        handleReloadNotification();
    } else {
        let folderId = notification.NotificationPayload.FolderId;
        const skypeTeamsProperties = notification.NotificationPayload.Item?.SkypeTeamsProperties;

        // We need to identify if the incoming notification payload is purely for a channel calendar meeting
        // Any teams online meeting will have a skypeTeamsProperties blob, but these are only meetings for which
        // their parentFolderId is customized in client side cache. Hence we check for absence of
        // calendar entry as well, before processing the teams calendar notification's folder Id.
        if (
            isFeatureEnabled('cal-showAddTeamsCalendars') &&
            skypeTeamsProperties &&
            !getCalendarEntryByFolderId(folderId)
        ) {
            folderId = getFolderIdFromTeamsSkypeBlobProperties(folderId, skypeTeamsProperties);

            if (notification.NotificationPayload.Item?.ParentFolderId) {
                notification.NotificationPayload.Item.ParentFolderId.Id = folderId;
            }
        }

        const isCacheInitialized = isEventsCacheInitialized(folderId);
        const allDateRanges = getAllLockedDateRanges(folderId);
        const allLockedEvents = getAllLockedEvents(folderId);
        const calendarEntry = getCalendarEntryByFolderId(folderId);
        const mailboxInfo = getMailboxInfoFromCalendarFolderId(folderId);

        // When notification is received for a birthday event, we should reload the entire cache for that folder
        // as the ItemIds for the updated events have changed and hence updating the event is not possible
        if (
            calendarEntry &&
            calendarEntry.CalendarFolderType == CalendarFolderTypeEnum.BirthdayCalendar
        ) {
            handleReloadNotification(folderId);
        } else if (
            isCacheInitialized &&
            (allDateRanges.length > 0 || Object.keys(allLockedEvents).length > 0)
        ) {
            // To consume the notification, calendar item cache should have been initialized with a date range otherwise insert of item and reload of cache will fail.
            // itemsCache can exist while the server call is being made to load data but cacheRange is set only when items have been attempted to be added once.
            if (
                notification.NotificationPayload.EventType == NotificationTypeConstants.RowDeleted
            ) {
                handleRowDeletedNotification(folderId, notification.NotificationPayload);
            } else if (isRecurringMaster(notification.NotificationPayload.Item.CalendarItemType)) {
                handleRecurringItemNotification(folderId, mailboxInfo, notification);
            } else {
                handleSingleItemNotification(
                    folderId,
                    mailboxInfo,
                    notification.NotificationPayload
                );
            }
        } else {
            logNotificationUpdateForDiagnosticsAsync({
                message: isCacheInitialized
                    ? 'Events cache was empty for folder'
                    : 'Events cache has not been loaded for folder yet',
                folderId: notification.NotificationPayload.FolderId,
                notificationPayload: notification.NotificationPayload,
            });
        }
    }
}

/**
 * Enqueues incoming notification (export should *only* be used by unit tests)
 * @param notification The notification
 */
export function enqueueNotification(notification: CalendarItemNotificationPayloadExtended) {
    if (notificationsQueue.some(a => isReloadNotification(a.NotificationPayload))) {
        // If there is already a reload notification in the queue, we do not add any more notifications to the queue because there is no point
        // in processing individual notifications if we are just going to end up reloading everything anyways.
        logNotificationUpdateForDiagnosticsAsync({
            message:
                'A reload notification is in the queue. No additional notifications will be added',
            notificationPayload: notification.NotificationPayload,
        });
    } else if (isReloadNotification(notification.NotificationPayload)) {
        // If the notification is for a reload, we can remove everything from the cache, because there is no point
        // in processing individual notifications if we are just going to end up reloading everything anyways.
        // reload notifications will also be queued and processed when timer ends, as we have seen instances of multiple reload notifications bombarding the client.
        logNotificationUpdateForDiagnosticsAsync({
            message:
                'A reload notification will be enqueued. All existing notifications will be discarded.',
            notificationPayload: notification.NotificationPayload,
        });
        notificationsQueue = [];
        notificationsQueue[0] = notification;
    } else {
        // The first thing that we need to do is see if there is already a notification for that same item.
        // If there is one, we'll remove it so we only process the most recent one.
        for (let i = notificationsQueue.length - 1; i >= 0; i--) {
            // If the InstanceKey is present (for the case of server-generated notifications), we'll use it
            // for the comparison. If it isn't (offline notifications), we'll use the id.
            let calItemInQueue: CalendarItem = notificationsQueue[i].NotificationPayload.Item;
            let valueForComparisonFromQueue: string;
            let valueForComparisonFromNotification: string;
            let traceSuffix: string;

            if (notification.NotificationPayload.Item.InstanceKey != null) {
                valueForComparisonFromNotification =
                    notification.NotificationPayload.Item.InstanceKey;
                valueForComparisonFromQueue = calItemInQueue.InstanceKey;
                traceSuffix = 'InstanceKey';
            } else {
                valueForComparisonFromNotification =
                    notification.NotificationPayload.Item.ItemId.Id;
                valueForComparisonFromQueue = calItemInQueue.ItemId.Id;
                traceSuffix = 'ItemId';
            }

            if (valueForComparisonFromNotification === valueForComparisonFromQueue) {
                logNotificationUpdateForDiagnosticsAsync({
                    message: `Found an existing notification in the queue for the same ${traceSuffix}. Old notification will be removed.`,
                    notificationPayload: notification.NotificationPayload,
                });
                if (notificationsQueue[i].InstanceKeyToDelete) {
                    // if the old notification had an instance key marked to delete, keep that around
                    notification.InstanceKeyToDelete = notificationsQueue[i].InstanceKeyToDelete;
                }
                notificationsQueue.splice(i, 1);

                // We don't need to keep looking because we can never have more than one notification for the
                // same item in the queue (the code currently being executed guarantees this).
                break;
            }
        }

        // There is a special case that we need to handle. When the user accepts a meeting via Outlook, this is what happens:
        // 1) The calendar item is cloned and marked with the user's response (this generates a RowAdded notification for the cloned item with
        //    a different InstanceKey, since it is a new item in the store, but with the same UID, because conceptually it is the same meeting).
        // 2) The old calendar item is deleted (generates 3 notifications - RowModified, RowModified, RowDeleted). One caveat here is that
        //    RowDeleted only has the InstanceKey and doesn't have the UID (this is a limitation from the store).

        // Things get interesting when a series is being accepted: when we handle the RowAdded, we'll make another trip to the server asking it to expand
        // the series (the notification that we receive is for the master). While we wait for the server to respond, we process the RowDeleted notification,
        // so the series disappears from the surface for a while. Once the request with the expanded series comes back, the items are added again.
        // What we want to do here to avoid flickering is to only delete the old items when we are ready to add the newly expanded series. Here's how
        // we'll achieve this:
        // a) When we receive a RowModified notification for a recurring item (which always precedes the RowDeleted), we'll store a mapping between
        //    InstanceKey -> UID. This will be useful later when we receive the RowDeleted notification (which has IK, but no UID).
        // b) When the notification for RowDeleted comes in, it doesn't carry the UID but, because we have the mapping described above, we can
        //    determine its UID based on the IK.
        // c) Now that we know the UID, we can scan the queue one more time to see if there is a RowAdded notification for a recurring item with
        //    that same UID. If we find it, we can combine them into one, which will do both the delete of the old series and the add for the new one,
        //    and discard the delete notification. Since the two operations will happen right after the other, there should be no visible flickering.

        // A related case comes with Declined Events. When any client (not just legacy clients) declines a full series, we get 5 notifications - Modified,
        // Modified, Deleted (same as above) all with the same InstanceKey, then an Added and a Modified with the same UID but a new InstanceKey. This comes
        // from when the old series gets declined on the server, and a new series created in it's place. The same fix applies here as well to avoid flickering-
        // map the InstanceKey -> UID, then if we receive an added/modified for the same UID, remove the delete from the queue.

        /**
            Test matrix for any future changes. name of action: expected notifications in order -> squashed notifications
            incoming notifications (send self meetings from another):
            Incoming Meeting: A
            Incoming recurring: AM -> M
            incoming series cancel: M -> M
            imcoming occurrence cancel: MMM -> M

            two owa windows, perform action in one and see how other responds:
            Create Meeting: AMM -> M
            Cancel Meeting: MMD -> D
            Add/Delete Appointment: A/D
            Accept series myself: M -> M
            Accept Instance myself: MM -> M
            Create recurring meeting: AMMM -> M
            cancel recurring meeting: MMD -> D
            Add/D recurring appt: A/M D -> A/D
            remove from calendar: D -> D
            decline a series: MMDAM -> DM

            desktop outlook actions, perform action in desktop and see how owa responds:
            Accept from Desktop Outlook: MDAM -> DM
            Accept series from desktop: MDAM -> DM
            accept instance from desktop: M -> M
         */
        let skipNotification: boolean = false;
        if (notification.NotificationPayload.Item.InstanceKey != null) {
            if (
                notification.NotificationPayload.EventType ==
                    NotificationTypeConstants.RowModified &&
                isRecurringMaster(notification.NotificationPayload.Item.CalendarItemType)
            ) {
                // If the notification has a UID, add it to the mapping (see (a) in the comments above)
                if (notification.NotificationPayload.Item.UID != null) {
                    instanceKeyToUid[notification.NotificationPayload.Item.InstanceKey] =
                        notification.NotificationPayload.Item.UID;
                }
            }

            // after adding your current rowModified to the mappings, might have to remove existing deletes in the queue - this happens when declining a series
            if (
                notification.NotificationPayload.EventType === NotificationTypeConstants.RowAdded ||
                notification.NotificationPayload.EventType === NotificationTypeConstants.RowModified
            ) {
                // search the existing queue to see if there are any Deletes with the same mapping for this notification, if there are remove them from the queue
                for (let i = notificationsQueue.length - 1; i >= 0; i--) {
                    // We'll do the comparison based on UID this time.
                    if (
                        notificationsQueue[i].NotificationPayload.EventType ===
                            NotificationTypeConstants.RowDeleted &&
                        notificationsQueue[i].OriginalUID ==
                            notification.NotificationPayload.Item.UID
                    ) {
                        logNotificationUpdateForDiagnosticsAsync({
                            message:
                                'Found an existing RowDeleted notification in the queue for the same UID, which will be removed from the queue.',
                            notificationPayload: notification.NotificationPayload,
                        });
                        notification.InstanceKeyToDelete =
                            notificationsQueue[i].NotificationPayload.Item.InstanceKey;
                        notificationsQueue.splice(i, 1);
                        break;
                    }
                }
            } else if (
                notification.NotificationPayload.EventType === NotificationTypeConstants.RowDeleted
            ) {
                // once we see the delete notification, add the UID to the notification in the queue and remove from the global map
                let uidForNotification =
                    instanceKeyToUid[notification.NotificationPayload.Item.InstanceKey];
                delete instanceKeyToUid[notification.NotificationPayload.Item.InstanceKey];

                if (uidForNotification) {
                    notification.OriginalUID = uidForNotification;

                    // check to see if there's an existing added or modified in the queue for same UID, if so then do not add self to the queue
                    // Now we'll do another pass at the list, looking for a RowAdded notification that we can merge with (step (c) above)
                    for (let i = notificationsQueue.length - 1; i >= 0; i--) {
                        // We'll do the comparison based on UID this time.
                        let uidInQueue = notificationsQueue[i].NotificationPayload.Item.UID;
                        if (
                            (notificationsQueue[i].NotificationPayload.EventType ===
                                NotificationTypeConstants.RowAdded ||
                                notificationsQueue[i].NotificationPayload.EventType ===
                                    NotificationTypeConstants.RowModified) &&
                            uidInQueue == uidForNotification
                        ) {
                            logNotificationUpdateForDiagnosticsAsync({
                                message:
                                    'Found an existing RowAdded or RowModified notification in the queue for the same UID, which will be merged with the RowDelete.',
                                notificationPayload: notification.NotificationPayload,
                            });
                            notificationsQueue[i].InstanceKeyToDelete =
                                notification.NotificationPayload.Item.InstanceKey;
                            skipNotification = true;
                            break;
                        }
                    }
                }
            }
        }
        if (!skipNotification) {
            // Now that we removed redundant notifications, we'll add the new one
            logNotificationUpdateForDiagnosticsAsync({
                message: 'Notification will be enqueued',
                notificationPayload: notification.NotificationPayload,
            });
            notificationsQueue.push(notification);
        } else {
            logNotificationUpdateForDiagnosticsAsync({
                message:
                    'RowDeleted notification was merged with a RowAdded notification for the same UID and will not be enqueued',
                notificationPayload: notification.NotificationPayload,
            });
        }
    }

    logNotificationUpdateForDiagnosticsAsync({
        message: `Notification queue length is ${notificationsQueue.length}`,
    });
}
/**
 * Drains the Notification queue and processes each item in the queue (export should *only* be used by unit tests)
 */
export function drainNotificationQueue() {
    let notificationsToProcessCount = notificationsQueue.length;
    // if queue contains 8 or more notifications or if the queue contains at least one reload notification, then trigger a reload and discard everything in queue.
    // this is done to avoid bombarding the server with 8 or more simultaneous calls which is server-side throttling limit per ows api
    if (
        notificationsToProcessCount >= 8 ||
        notificationsQueue.some(a => isReloadNotification(a.NotificationPayload))
    ) {
        handleReloadNotification();
    } else {
        for (let i = 0; i < notificationsToProcessCount; i++) {
            let notification = notificationsQueue[i];
            handleNotificationInternal(notification);
        }
    }
    notificationsQueue = [];
    instanceKeyToUid = {};
    clearTimeout(notificationQueueTimer);
}

/**
 * Clears the notifications queue - to be used only by tests
 */
export function clearNotificationQueue() {
    notificationsQueue = [];
}

function traceNotificationData(notification: CalendarItemNotificationPayload, incoming: boolean) {
    let itemId = notification.Item?.ItemId ? notification.Item.ItemId.Id : '<null>';
    const messagePrefix = incoming
        ? 'Got calendar notification'
        : 'Processing calendar notification';
    logNotificationUpdateForDiagnosticsAsync({
        message: `${messagePrefix} for event type ${notification.EventType}`,
        folderId: notification.FolderId,
        notificationPayload: notification,
    });

    if (incoming) {
        let itemType = notification.Item ? notification.Item.CalendarItemType : '<null>';
        logUsage(
            'IncomingNotification',
            { NotificationType: notification.EventType, ItemType: itemType, ItemId: itemId },
            {
                excludeFromKusto: true,
                isVerbose: true,
            }
        );
    }
}

/**
 * Checks whether this is a reload notification
 * @param notification The notification to check
 */
function isReloadNotification(notification: CalendarItemNotificationPayload) {
    return notification.EventType == NotificationTypeConstants.Reload || notification.Reload;
}

/**
 * Reloads given folder or all subscribed calendar folder caches upon receiving a reload notification
 * Exported for development purposes only!
 */
export function handleReloadNotification(folderId?: string) {
    let folderIds = folderId ? [folderId] : Object.keys(subscriptions);
    for (let folderId of folderIds) {
        reloadItemsCache(folderId, true /** forceReplace */);
    }
}

/**
 * Handles a row deleted notification. When we receive a RowDeleted notification, we don't know if
 * it is for a single or recurring item, because the only piece of data that RowDeleted notifications
 * carry is the InstanceKey. Therefore, we won't have special processing for single vs recurring like
 * in the other cases.
 * @param itemsCache The items cache
 * @param notification The notification being processed
 */
function handleRowDeletedNotification(
    folderId: string,
    notification: CalendarItemNotificationPayload
) {
    let instanceKey = notification.Item.InstanceKey;

    // We treat this just as removing a series
    const event = getCalendarEventWithInstanceKey(instanceKey, folderId);
    if (event) {
        logNotificationUpdateForDiagnosticsAsync({
            message: `Removing event from cache ${event}`,
            folderId: folderId,
            notificationPayload: notification,
            notificationItem: event,
        });
        removeCalendarEventWithInstanceKeyFromEventsCache(folderId, instanceKey);
    } else {
        logNotificationUpdateForDiagnosticsAsync({
            message: `Could not find event with instance key ${instanceKey} in the cache to remove`,
            folderId: folderId,
            notificationPayload: notification,
        });
    }
}

/**
 * Handles a notification for a recurring item
 * @param itemsCache The items cache
 * @param notification The notification being processed
 */
function handleRecurringItemNotification(
    folderId: string,
    mailboxInfo: MailboxInfo,
    notification: CalendarItemNotificationPayloadExtended
) {
    // The notification indicates that something has changed on the series. We don't know if it is related to the
    // master or to an exception. So, if we have the series' UID, we'll ask the server to re-expand that series,
    // remove everything related to it from the cache and add the newly expanded items.
    // OneView: if we get notifications for the connected accounts as well, then we need to pass the right mailboxInfo for this calendarEvent so that further calls for this event can be routed correctly
    const calEvent: CalendarEvent = calendarEvent(
        notification.NotificationPayload.Item,
        mailboxInfo
    );
    if (calEvent.UID) {
        const dateRangesToExpand = getDateRangesToExpand(folderId);

        dateRangesToExpand.forEach(cacheRange => {
            const getExpandedItemActionV2 = expandCalendarEventService(calEvent.ItemId, cacheRange);

            getExpandedItemActionV2
                .then((response: ExpandCalendarEventResponse) => {
                    if (response && response.ResponseClass == 'Success') {
                        onSuccessfulExpandedRecurrence(
                            calEvent,
                            getExpandedItemActionV2,
                            cacheRange,
                            folderId,
                            // OneView: if we get notifications for the connected accounts as well, then we need to pass the right mailboxInfo for this calendarEvent so that further calls for this event can be routed correctly
                            response.Occurrences.map(item => calendarEvent(item, mailboxInfo)),
                            calendarEvent(response.RecurrenceMaster, mailboxInfo),
                            notification.InstanceKeyToDelete
                        );
                    } else {
                        onFailedExpandedRecurrence(
                            calEvent,
                            getExpandedItemActionV2,
                            cacheRange,
                            folderId,
                            notification.InstanceKeyToDelete,
                            response
                        );
                    }
                })
                .catch((error: Error) => {
                    onFailedExpandedRecurrence(
                        calEvent,
                        getExpandedItemActionV2,
                        cacheRange,
                        folderId,
                        notification.InstanceKeyToDelete,
                        null,
                        error.message
                    );
                });
        });
    }
}

/**
 * Callback for when we succeed to get the expanded recurring series for a notification item
 * @param notificationItem The notification item from which we expanded
 * @param getExpandedItemAction The action that was invoked to expand the item
 * @param requestedRange The date range for which we requested the expansion
 * @param itemsCache The items cache
 * @param expandedItems The expanded items returned from the expanded action service call
 * @param instanceKeyToDelete Also delete this instance key when the action returns
 */
function onSuccessfulExpandedRecurrence(
    notificationItem: CalendarEvent,
    getExpandedItemAction: Promise<ExpandCalendarEventResponse>,
    requestedRange: DateRange,
    folderId: string,
    expandedItems: CalendarEvent[],
    masterItem: CalendarEvent,
    instanceKeyToDelete: string
) {
    // Process expanded items
    logNotificationUpdateForDiagnosticsAsync({
        message: `Action to expand series completed successfully. Retrieved ${
            expandedItems ? expandedItems.length : 0
        } items for dates: ${requestedRange.start.toString()} - ${requestedRange.end.toString()} `,
        folderId: folderId,
        notificationItem: notificationItem,
    });

    // If the range in the cache is different from what we originally requested, we may have received less items than
    // we are currently showing. Therefore, if we simply added what we got back from the action, we may be missing items.
    // In this case we'll reload to be on the safe side.
    const dateRangesToExpand = getDateRangesToExpand(folderId);
    const isDateRangeInDateRangesToExpand = dateRangesToExpand.some(lockedDateRange =>
        areDateRangesEqual(requestedRange, lockedDateRange)
    );
    if (!isDateRangeInDateRangesToExpand) {
        logNotificationUpdateForDiagnosticsAsync({
            message:
                'Range in the cache is different from what we originally requested - reloading cache',
            folderId: folderId,
        });
        reloadItemsCache(folderId, true /** forceReplace */);
    } else {
        // Remove all the items related to the series
        logNotificationUpdateForDiagnosticsAsync({
            message: 'Updating all cached items for the series and removing nonexistant ones',
            folderId: folderId,
        });

        // expandedItems are all the true existing items from the server. Build a map of UIDs from these items so that
        // we can remove all series instance that are not present on the server
        // note that declined instances of a series have a different InstanceKey from the rest of the series but the same
        // seriesMasterId, so this UID array can also be used to filter declined instances
        const itemsFromServer = [];
        if (expandedItems) {
            itemsFromServer.push(...expandedItems);
        }
        if (masterItem) {
            itemsFromServer.push(masterItem);
        }
        const UIDArray = itemsFromServer.map(e => e.UID);
        const shouldRemoveItemFromSeries = (calendarEvent: CalendarEvent) => {
            // Remove all the series instances that are not present on the server.
            // If cached event is non-recurring (with same UID), it means recurrence is recently added
            // to the event, so remove non-recurring event from the cache.
            return !(UIDArray.includes(calendarEvent.UID) && calendarEvent.IsRecurring);
        };

        removeCachedEventsForSeries(
            requestedRange,
            notificationItem.ItemId.Id,
            notificationItem.InstanceKey,
            instanceKeyToDelete,
            folderId,
            shouldRemoveItemFromSeries
        );

        // update the Master in FullItem Cache
        updateFullCalendarEventFromServer(masterItem);

        // Add the expanded instances to the cache if applicable. We will take advantage of the fact that both the cache
        // and the list returned from the server (with the new instances) are sorted. No need to delete all the items in
        // the series since this will update them if they exist
        addCalendarEventsWithinCurrentLockedDateRanges(folderId, expandedItems);
        expandedItems.forEach(successfulItem => {
            updateFullCalendarEventFromServer(successfulItem);
        });
    }
}

/**
 * Callback for when we fail to get the expanded recurring series for a notification item
 * @param notificationItem The notification item from which we expanded
 * @param getExpandedItemAction The action that was invoked to expand the item's recurring series
 * @param itemsCache The items cache
 * @param instanceKeyToDelete Also delete this instance key when the action returns
 * @param response The response we got from the service call (if any)
 * @param exceptionMessage The exception message (if any)
 */
function onFailedExpandedRecurrence(
    notificationItem: CalendarEvent,
    getExpandedItemAction: Promise<ExpandCalendarEventResponse>,
    requestedRange: DateRange,
    folderId: string,
    instanceKeyToDelete: string,
    response: ExpandCalendarEventResponse,
    exceptionMessage: string = null
) {
    if (response && response.ResponseCode == 'ErrorItemNotFound') {
        logNotificationUpdateForDiagnosticsAsync({
            message:
                'Action to expand recurring series failed with item not found because item is not on the server. Removing series.',
            folderId: folderId,
            notificationItem: notificationItem,
        });
        removeCachedEventsForSeries(
            requestedRange,
            notificationItem.ItemId.Id,
            notificationItem.InstanceKey,
            instanceKeyToDelete,
            folderId
        );
    } else {
        // If we don't know what went wrong, we'll reload to make sure that we don't have stale data
        const errorMessage = response
            ? `${response.ResponseCode}: ${response.MessageText}`
            : exceptionMessage;
        logNotificationUpdateForDiagnosticsAsync({
            message: 'Action to expand recurring series failed for unknown reason, reloading cache',
            folderId: folderId,
            notificationItem: notificationItem,
            errorMessage: errorMessage,
        });
        reloadItemsCache(folderId, true /** forceReplace */);
    }
}

/**
 * Handles a notification for a single (non-recurring) calendar item
 * @param notification The notification being processed
 */
function handleSingleItemNotification(
    folderId: string,
    mailboxInfo: MailboxInfo,
    notification: CalendarItemNotificationPayload
) {
    // OneView: if we get notifications for the connected accounts as well, then we need to pass the right mailboxInfo for this calendarEvent so that further calls for this event can be routed correctly
    let calEvent = calendarEvent(notification.Item, mailboxInfo);
    let wasAlwaysSingleItem: boolean = false;

    // Even though the notification is for a single item, we may be dealing with something that used to be a series and
    // has just been turned into a single item. The only cases where we can be sure that this has always been a single item are:
    // 1) There is no instance key in the notification: this indicates that it is a notification for an item that has been
    //    created offline and, since we don't support the creation of recurring items offline, we know that it has to be a
    //    true single item.
    // 2) The notification is a RowAdded: this always indicates a brand new item, so it can't be a series that was modified
    //    to be a single meeting.
    switch (notification.EventType) {
        case NotificationTypeConstants.RowAdded:
            wasAlwaysSingleItem = true;
            break;

        case NotificationTypeConstants.RowModified:
            // If the item used to be a series, but is now a single item, we have to make sure the entire series
            // is removed from the cache here. However, if the notification is for the exception / occurrence directly,
            // we only want to update that specific item. Only offline generates notifications for items in a series,
            // the server will always issue a RecurringMaster notification whenever any item in the series changes.
            wasAlwaysSingleItem =
                calEvent.InstanceKey == null ||
                isOccurrence(calEvent.CalendarItemType) ||
                isException(calEvent.CalendarItemType);
            break;
    }

    addOrModifyItemInCache(
        calEvent,
        wasAlwaysSingleItem,
        false /* add to cache if not present */,
        true /* update full item from server */
    );
}

/**
 * Remove items for the series from the caches. This will handle removal of items in a recurring series.
 * Optionally, it supports checking an additional condition to remove. The items will be removed from all
 * internal caches and the calendar surface. This also handles the removal of the local lie added in
 * instantCalendarEventCreate.
 * @param expandedDateRange The date range to remove cached events from
 * @param seriesMasterId The series master Id for the series to be removed
 * @param instanceKey1 The instance key for the item(s) to be removed
 * @param instanceKey2 Instance key of the old version of the series. Can be null or undefined.
 * Useful for the cases where the user performed an A|T operation, which, on the server side, will
 * create a different object in the store (with a different instance key).
 * @param folderId The folderId to look for items to remove
 * @param shouldRemoveItemFromSeries an optional check to see if the item should actually be removed, even
 * if it matches the series and is in the date range. Defaults to just returning true
 */
function removeCachedEventsForSeries(
    expandedDateRange: DateRange,
    seriesMasterId: string,
    instanceKey1: string,
    instanceKey2: string,
    folderId: string,
    shouldRemoveItemFromSeries?: (calendarEvent: CalendarEvent) => boolean
) {
    const itemFilter = (calendarEvent: CalendarEvent) => {
        const calEventRange: DateRange = {
            start: calendarEvent.Start,
            end: calendarEvent.End,
        };

        const isCalEventInRange =
            dateRangesOverlap(expandedDateRange, calEventRange, true) == 0 ? true : false;

        const matchesSeries =
            calendarEvent.InstanceKey == instanceKey1 ||
            (instanceKey2 && calendarEvent.InstanceKey == instanceKey2) ||
            (seriesMasterId && seriesMasterId === calendarEvent.SeriesMasterItemId?.Id);

        // Note that this removes all local lies, not just lies for events that match the current series. This ensures that local lies for
        // "This and all following" are removed, even though the series id changes for the new series.
        return (
            isCalEventInRange &&
            /**
             * In case of recurring items the local lies are not deleted by `instantCalendarEventCreate`. We depended on notifications to remove those items from cache.
             * When creating local lies for calendar events (via `applyLocalLiePropertiesToSeriesEvents`), properties are set to indicate that the event is a local lie.
             * We check for the presence of these properties with `isCalendarEventLocalLie`.
             *  */
            (isCalendarEventLocalLie(calendarEvent) ||
                (matchesSeries &&
                    (shouldRemoveItemFromSeries
                        ? shouldRemoveItemFromSeries(calendarEvent)
                        : true)))
        );
    };

    removeCalendarEventsFromEventsCacheMatchingFilter(folderId, itemFilter);

    // TODO: VSO #30430: We are not removing it from the cache but only invoking this event so it gets removed from the surface.
    // This is not the ideal way but we have to do it till we deprecate surface store so it does not have
    // the calendar event stored in its own store. Once that is removed we don't need this anymore.
    const events = filterCalendarEvents(folderId, itemFilter);
    calendarEventsRemoved(events);
}

/**
 * Pauses the processing of notifications
 * Notifications will be placed in a queue until the ResumeNotificationsProcessing method is invoked.
 */
export function suspendNotificationsProcessing() {
    // only pause if already resumed
    if (processNotifications) {
        clearTimeout(notificationQueueTimer);

        logNotificationUpdateForDiagnosticsAsync({
            message: 'Processing of notifications will be suspended',
        });
        processNotifications = false;
    }
}

/**
 * Resumes the processing of notifications.
 * Notifications that were previously queued up will be set up to process
 */
export function resumeNotificationsProcessing() {
    // only resume if already paused
    if (!processNotifications) {
        processNotifications = true;

        logNotificationUpdateForDiagnosticsAsync({
            message: 'Processing of notifications will be resumed',
        });
        notificationQueueTimer = setTimeout(
            drainNotificationQueue,
            ProcessNotificationAfterMilliseconds
        );
    }
}

/**
 * Once we identify that the notification payload is for a teams calendar event.
 * We need to customize the folder id to the format in which client side cache will understand
 * Format: FolderId__CHANNELTEAMSTYPE_ChannelId
 * To do: Link WI# 77804 documentation over here.
 */
function getFolderIdFromTeamsSkypeBlobProperties(
    folderId: string,
    skypeTeamsProperties: string
): string {
    let parsedSkypeTeamsProps = JSON.parse(skypeTeamsProperties);
    if (parsedSkypeTeamsProps?.cid) {
        const uniqueCid = parsedSkypeTeamsProps.cid.split('@')[0];
        folderId = uniqueCid ? joinFolderIdAndChannelId(folderId, uniqueCid) : folderId;
    }

    return folderId;
}

function getDateRangesToExpand(folderId: string): DateRange[] {
    const allCachedDateRanges = getAllLockedDateRanges(folderId);
    return mergeAllOverlappingDateRanges(allCachedDateRanges);
}
