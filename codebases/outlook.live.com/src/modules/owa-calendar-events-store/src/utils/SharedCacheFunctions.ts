import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import type { CalendarEventEntity } from '../store/schema/CalendarEventEntity';
import { calendarEventsRemoved, calendarEventsAdded } from '../actions/publicActions';
import { reloadCalendarEventsCache } from './eventsCache/reloadCalendarEventsCache';
import { trace } from 'owa-trace';
import {
    getCalendarEventWithId,
    filterCalendarEvents,
} from '../selectors/calendarFolderEventsSelectors';
import {
    updateFullCalendarEventFromServer,
    updateFullCalendarEventFromPartialCalendarEvent,
    upsertCalendarEventsToEventsCache,
} from '../actions/eventsCacheActions';

/**
 * Adds or modified a calendar item in the internal caches and notifies the calendar surface
 * of the updates
 * @param calendarEvent The calendar event
 * @param wasAlwaysSingleItem Whether this item was always a single item (was not just turned from series into single)
 * @param modifyOnly Whether or not to add to the cache, if item not found in the cache, i.e., a pure modify operation
 * @param updateFullItem Whether or not to update the full item in cache via server (i.e loadCalendarEvent) call
 */
export function addOrModifyItemInCache(
    calendarEvent: CalendarEvent,
    wasAlwaysSingleItem: boolean,
    modifyOnly: boolean,
    updateFullItem: boolean = false
): void {
    const folderId = calendarEvent.ParentFolderId.Id;
    let skipInsert: boolean = false;
    let cachedItem = findCachedItem(folderId, calendarEvent, wasAlwaysSingleItem);
    if (cachedItem) {
        if (cachedItem.IsRecurring && !wasAlwaysSingleItem) {
            // Remove series (only if we are updating the full item from server post notification)
            if (updateFullItem) {
                // We are not removing it from the cache but only invoking this event so it gets removed from the surface
                // as the cache is able to handle update of existing item in cache.
                // TODO: VSO #30430: Remove this once the surface store is not maintaining a copy of its own models
                calendarEventsRemoved([cachedItem]);
            } else {
                // skip removing and re-inserting series if we are not updating full item (which is during instant update)
                skipInsert = true;
            }
        } else {
            // Remove single item
            // we are not removing the series items as we are not updating the lie items on surface for series items, they will get updated when notification comes in.
            // TODO: VSO #30430: Remove this once the surface store is not maintaining a copy of its own models

            // TODO: WI 77364 - Validate if Notifications can return these two properties
            if (
                calendarEvent.IsOnlineMeeting == undefined &&
                cachedItem.IsOnlineMeeting != undefined
            ) {
                calendarEvent.IsOnlineMeeting = cachedItem.IsOnlineMeeting;
            }

            if (
                calendarEvent.OnlineMeetingJoinUrl == undefined &&
                cachedItem.OnlineMeetingJoinUrl != undefined
            ) {
                calendarEvent.OnlineMeetingJoinUrl = cachedItem.OnlineMeetingJoinUrl;
            }

            calendarEventsRemoved([cachedItem]);
        }
    } else {
        // The item was not found in cache
        trace.info(
            '[SharedCacheFunctions] addOrModifyItemInCache: Skipping removal of old item from cache as no old item was found'
        );
    }

    if (cachedItem || !modifyOnly) {
        if (!skipInsert) {
            upsertCalendarEventsToEventsCache(
                folderId,
                [calendarEvent],
                [{ start: calendarEvent.Start, end: calendarEvent.End }]
            );
            calendarEventsAdded([calendarEvent]);
        }

        if (updateFullItem) {
            updateFullCalendarEventFromServer(calendarEvent);
        } else {
            updateFullCalendarEventFromPartialCalendarEvent(calendarEvent);
        }
    }
}

/**
 * Attempts to find an item in the items cache
 * @param folderId The folder id
 * @param calendarEvent The calendar item
 * @param wasAlwaysSingleItem Whether this item was always a single item (was not just turned from series into single)
 * @returns A FindInArrayResult holding the CalendarEvent object and the index of the cache entry,
 * if found or null if not found
 */
function findCachedItem(
    folderId: string,
    calendarEvent: CalendarEvent,
    wasAlwaysSingleItem: boolean
): CalendarEventEntity {
    let cachedItem: CalendarEventEntity = null;

    if (wasAlwaysSingleItem) {
        cachedItem = getCalendarEventWithId(calendarEvent.ItemId.Id, folderId);
    } else {
        let findItemByInstanceKey = (event: CalendarEventEntity) => {
            return event.InstanceKey == calendarEvent.InstanceKey;
        };
        [cachedItem] = filterCalendarEvents(folderId, findItemByInstanceKey);
    }

    // If the item was not found, we may have a newly created fake item in the table that now needs
    // to be replaced. This could happen if we get the notification before getting the response back
    // from the action that created/updated the item
    if (!cachedItem) {
        const temporaryId = calendarEvent.ClientSeriesId;
        if (temporaryId) {
            const findItemByClientSeriesId = (event: CalendarEventEntity) => {
                return event.ClientSeriesId == temporaryId;
            };
            [cachedItem] = filterCalendarEvents(folderId, findItemByClientSeriesId);
        }
    }

    return cachedItem;
}

/**
 * reload the items cache
 *
 * @param folderId folderId to reload
 * @param forceReplace if forceReplace is true, we replace the items in the cache with the reloaded items.
 * If forceReplace is false, we upsert the reloaded items. forceReplace should be true when the cache could contain events that have since been removed.
 */
export async function reloadItemsCache(folderId: string, forceReplace: boolean = false) {
    await reloadCalendarEventsCache(folderId, forceReplace);
}
