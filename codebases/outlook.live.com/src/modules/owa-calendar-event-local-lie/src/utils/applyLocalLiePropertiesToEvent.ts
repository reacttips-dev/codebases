import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import itemId from 'owa-service/lib/factory/itemId';
import { getGuid } from 'owa-guid';

/**
 * Applies local lie properties to series calendar events
 * The resulting calendar events will all have InstanceKeys which equal the ClientSeriesId.
 * @param items series calendar events
 * @param overwriteProperties whether to overwrite the ClientSeriesId and InstanceKey properties even if they exist. This
 * handles when we're creating a new local lie for an existing item getting a new series created around it i.e. This and Following
 */
export function applyLocalLiePropertiesToSeriesEvents(
    items: CalendarEvent[],
    overwriteProperties: boolean
) {
    let clientSeriesId = getGuid();
    items.forEach(item => {
        // We can't have the same ItemId for instances of a recurring meeting as it's the primary key for the cache,
        // but the InstanceKey will be set to clientSeriesId for isCalendarEventLocalLie check for local lie.
        const temporaryItemId = getGuid();
        applyLocalLiePropertiesToEventInternal(
            item,
            clientSeriesId,
            temporaryItemId,
            overwriteProperties
        );
        item.IsRecurring = true;
        item.InstanceKey =
            item.InstanceKey && !overwriteProperties ? item.InstanceKey : clientSeriesId; // All instances given the same client series id here
    });
}

/**
 * Applies local lie properties to a non-recurring calendar event.
 * The resulting calendar event will have an ItemId which is equal to the ClientSeriesId.
 * @param item non-recurring calendar event
 */
export function applyLocalLiePropertiesToSingleEvent(item: CalendarEvent) {
    const clientSeriesId = getGuid();
    // We want to make the ItemId match the ClientSeriesId for non-recurring meetings
    applyLocalLiePropertiesToEventInternal(item, clientSeriesId, clientSeriesId, false);
}

/**
 * @param item calendar event to be updated
 * @param clientSeriesId client series id used to identify all events in a series
 * @param temporaryItemId temporary item id used to uniquely identify each event
 * @param overwriteClientSeriesId overwrite the item ClientSeriesId even if defined
 */
function applyLocalLiePropertiesToEventInternal(
    item: CalendarEvent,
    clientSeriesId: string,
    temporaryItemId: string,
    overwriteClientSeriesId: boolean
) {
    item.ItemId = {
        ...itemId({ Id: temporaryItemId }),
        mailboxInfo: item.ParentFolderId.mailboxInfo,
    };
    if (!item.ClientSeriesId || overwriteClientSeriesId) {
        // If we have the ClientSeriesId already set, then it means this is the retry scenario
        // In the retry scenario, we don't override the clientSeriesId since we want the server to be
        // able to de-duplicate in case the failed request created the item for some reason
        item.ClientSeriesId = clientSeriesId;
    }

    item.EffectiveRights = {
        Read: true,
        Modify: true,
        Delete: true,
        ViewPrivateItems: true,
    };
    item.IsOrganizer = true;
}
