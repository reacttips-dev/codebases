import { expandRecurringItem } from '../utils/expandRecurringItem';
import getItemIdToUpdate from '../utils/getItemIdToUpdate';
import { applyLocalLiePropertiesToSeriesEvents } from 'owa-calendar-event-local-lie';
import { addOrModifyItemInCache, reloadItemsCache } from '../utils/SharedCacheFunctions';
import type { ViewType } from 'owa-calendar-actions';
import { isException, isOccurrence, isRecurringMaster } from 'owa-calendar-event-capabilities';
import type {
    default as CalendarEvent,
    CalendarItemTypeTypeEx,
} from 'owa-calendar-types/lib/types/CalendarEvent';
import { isBefore, compare, startOfDay, OwaDate, owaDate } from 'owa-datetime';
import EventScope from 'owa-service/lib/contract/EventScope';
import { orchestrator } from 'satcheljs';
import {
    isEventsCacheInitialized,
    getAllLockedDateRanges,
} from '../selectors/eventsCacheSelectors';
import {
    getCalendarEventWithId,
    filterCalendarEvents,
} from '../selectors/calendarFolderEventsSelectors';
import {
    addCalendarEventsWithinCurrentLockedDateRanges,
    removeCalendarEventsFromEventsCacheMatchingFilter,
    updateItem,
} from '../actions/eventsCacheActions';
import {
    instantCalendarEventUpdate,
    CalendarEventOperationResult,
    calendarEventUpdated,
} from '../actions/publicActions';
import { isConnectedAccount } from 'owa-accounts-store';
import type { DateRange } from 'owa-datetime-utils';

orchestrator(instantCalendarEventUpdate, async actionMessage => {
    const {
        eventId,
        eventChanges,
        errorMessage,
        actionToExecute,
        onEventUpdateFailed,
        onEventUpdateSuccess,
        onEventUpdatedLocally,
        actionSource,
    } = actionMessage;

    let eventScope = actionMessage.eventScope;

    // We first check if the event is in our cache, if not then we use the one provided in the message
    let cachedEvent = getCalendarEventWithId(eventId.Id);

    let idToUpdate = getItemIdToUpdate(eventId.Id, actionMessage.eventScope);

    if (cachedEvent && isRecurringMaster(cachedEvent.CalendarItemType)) {
        eventScope = EventScope.AllInstancesInSeries;
    }

    let allowLocalUpdate = isInstantUpdateSupported(cachedEvent, eventChanges);
    if (allowLocalUpdate) {
        onUpdateItemStart(
            cachedEvent,
            eventChanges,
            eventScope,
            onEventUpdatedLocally,
            actionSource
        );
    }
    let retryFunction = () =>
        instantCalendarEventUpdate(
            eventId,
            eventChanges,
            eventScope,
            actionToExecute,
            onEventUpdateSuccess,
            () => onEventUpdateFailed(errorMessage, null, actionSource),
            actionSource,
            errorMessage
        );

    let result: CalendarEventOperationResult = null;
    try {
        result = await actionToExecute(idToUpdate);
    } catch (error) {
        // Exception, assume update failed
        if (allowLocalUpdate) {
            reloadItemsCache(cachedEvent.ParentFolderId.Id);
        }
        onEventUpdateFailed(error, retryFunction, actionSource);
        throw error;
    }

    if (!result.isSuccessful) {
        // Either response failed or we got no item back
        if (allowLocalUpdate) {
            reloadItemsCache(cachedEvent.ParentFolderId.Id);
        }
        onEventUpdateFailed(errorMessage, retryFunction, actionSource);
        throw errorMessage;
    }

    // If the parent folder id changed (for connected accounts), reload the items in cache for both parent folder ids (old and new)
    // forceReload is true because we need to replace the events in cache
    // Bug 84781: [ConnectedAccounts] Remove logic to reload items in cache when the notification issue is fixed
    if (
        eventChanges.ParentFolderId?.mailboxInfo &&
        isConnectedAccount(eventChanges.ParentFolderId.mailboxInfo.userIdentity)
    ) {
        reloadItemsCache(eventChanges.ParentFolderId.Id, true /* forceReload */);
        reloadItemsCache(cachedEvent.ParentFolderId.Id, true /* forceReload */);
    }

    onEventUpdateSuccess();
});

function onUpdateItemStart(
    itemBeforeUpdate: CalendarEvent,
    itemChanges: CalendarEvent,
    eventScope: EventScope,
    onItemUpdatedLocally: (updatedEvent: CalendarEvent, actionSource: ViewType) => void,
    actionSource: ViewType
): void {
    // Create new item with all props from original item + changes
    const folderId = itemBeforeUpdate.ParentFolderId.Id;
    if (
        isOccurrence(itemBeforeUpdate.CalendarItemType) &&
        (eventScope == EventScope.Default || eventScope == EventScope.ThisInstanceOnly)
    ) {
        // updating occurrences of a series makes them exceptions
        itemChanges.CalendarItemType = 'Exception';
    }

    let itemForSave: CalendarEvent = { ...itemBeforeUpdate, ...itemChanges };

    if (
        eventScope == EventScope.AllInstancesInSeries ||
        eventScope == EventScope.ThisAndFollowingInstances
    ) {
        if (
            itemChanges.Recurrence ||
            itemChanges.Start ||
            itemChanges.StartTimeZoneId ||
            itemChanges.End ||
            itemChanges.EndTimeZoneId ||
            eventScope == EventScope.ThisAndFollowingInstances
        ) {
            let start = itemBeforeUpdate.Start;

            // if changing the recurrence pattern, remove all existing items and recreate them
            // remove both exceptions and occurrences because changing the recurrence pattern will overwrite all exceptions
            removeCalendarEventsFromEventsCacheMatchingFilter(folderId, item => {
                return (
                    (isOccurrence(item.CalendarItemType) || isException(item.CalendarItemType)) &&
                    item.InstanceKey == itemBeforeUpdate.InstanceKey &&
                    (eventScope == EventScope.AllInstancesInSeries ||
                        (eventScope == EventScope.ThisAndFollowingInstances &&
                            !isBefore(item.Start, start)))
                );
            });

            // Local lies created here will get removed by the notifications architecture even though we have nothing tying the old
            // series to the notification for the new series
            if (
                eventScope === EventScope.AllInstancesInSeries ||
                eventScope === EventScope.ThisAndFollowingInstances
            ) {
                let allCachedDateRanges = getAllLockedDateRanges(folderId);

                if (eventScope === EventScope.ThisAndFollowingInstances) {
                    // remove date ranges that are from before the event so we don't make duplicate local lies
                    // need to clone the date ranges so we don't try to mutate the store values directly
                    allCachedDateRanges = allCachedDateRanges.map(dateRange => ({
                        start: owaDate(dateRange.start.tz, dateRange.start),
                        end: owaDate(dateRange.end.tz, dateRange.end),
                    }));
                    getDateRangesAfterDate(allCachedDateRanges, itemBeforeUpdate.Start);
                }

                let itemToExpand = itemForSave;

                // if the item passed is an occurrence, and the Recurrence pattern isn't being changed, itemForSave will not have
                // the Recurrence property on it. Need to get the series master from the cache. If the update is happening from
                // an edit form, the full item should be in the cache, but if not, we will just use the original item as an expansion
                // which will remove future items and not replace them rather than wait to fetch the full item from the server. Either
                // way, notification will clean up.
                if (itemForSave.CalendarItemType == 'Occurrence' && !itemForSave.Recurrence) {
                    itemToExpand = getCalendarEventWithId(itemForSave.SeriesMasterItemId.Id);
                    if (!itemToExpand) {
                        // if series master is not in cache, at least use the original item so the request still goes out and
                        // notification can clean up, despite local lies being wrong
                        itemToExpand = itemForSave;
                    }
                }

                let expandedItems = expandRecurringItem(itemToExpand, allCachedDateRanges);

                applyLocalLiePropertiesToSeriesEvents(expandedItems.concat(itemForSave), true);

                // clear the series item's start/end before applying the changes to instance events, as these properties do not
                // apply to the instances
                delete itemChanges.Start;
                delete itemChanges.End;
                let itemsWithLies = expandedItems.map(occurrence => ({
                    ...occurrence,
                    ...itemChanges,
                    CalendarItemType: 'Occurrence' as CalendarItemTypeTypeEx,
                }));
                addCalendarEventsWithinCurrentLockedDateRanges(
                    itemForSave.ParentFolderId.Id,
                    itemsWithLies
                );
            }
        } else {
            let cachedOccurrences = filterCalendarEvents(folderId, (item: CalendarEvent) => {
                return (
                    item.InstanceKey == itemBeforeUpdate.InstanceKey &&
                    isOccurrence(item.CalendarItemType)
                );
            });

            // Update the cache entries directly
            for (let cachedOccurrence of cachedOccurrences) {
                let itemModel = cachedOccurrence;
                updateItem(itemModel, itemChanges);
                calendarEventUpdated(itemModel);
            }
        }
    }

    // If the caller wants to update the entire series from an exception, do not update the exception item
    // Series updates do not apply to exceptions
    if (
        !(
            isException(itemBeforeUpdate.CalendarItemType) &&
            eventScope == EventScope.AllInstancesInSeries
        )
    ) {
        // Handle when item changes from recurring to single, in which case we remove all old occurrences and then insert the new
        // single item
        let wasAlwaysSingleItem =
            itemBeforeUpdate.InstanceKey == null ||
            isOccurrence(itemBeforeUpdate.CalendarItemType) ||
            isException(itemBeforeUpdate.CalendarItemType);

        // Do not add to the cache if not present. TODO: except if it's an update after we saved an attachment on a new item
        addOrModifyItemInCache(itemForSave, wasAlwaysSingleItem, true /* only modify in cache */);
    }
    onItemUpdatedLocally(itemForSave, actionSource);
}

function isInstantUpdateSupported(itemBeforeUpdate: CalendarEvent, itemChanges: CalendarEvent) {
    // If there is no item to update in the cache, then no instant updates
    if (!itemBeforeUpdate) {
        return false;
    }

    // If there is no loaded cache for the item being updated, this means that we are adding
    let calendarId = itemBeforeUpdate.ParentFolderId.Id;
    if (!isEventsCacheInitialized(calendarId)) {
        return false;
    }

    // We do not support instant updates for changes across calendars
    let changedCalendarId = itemChanges.ParentFolderId;
    if (changedCalendarId && changedCalendarId.Id != calendarId) {
        return false;
    }

    return true;
}

/**
 * transforms the given date ranges to remove ranges that are entirely before the given
 * date, and change date ranges that overlap the date to start at the date
 * @param dateRanges
 * @param date
 */
function getDateRangesAfterDate(dateRanges: DateRange[], date: OwaDate) {
    let indicesToRemove = [];
    dateRanges.forEach((dateRange, index) => {
        if (compare(dateRange.start, date) <= 0 && compare(dateRange.end, date) <= 0) {
            indicesToRemove.push(index);
        }
        if (compare(dateRange.start, date) <= 0 && compare(dateRange.end, date) > 0) {
            dateRange.start = startOfDay(date);
        }
    });
    indicesToRemove.reverse().forEach(index => {
        dateRanges.splice(index, 1);
    });
}
