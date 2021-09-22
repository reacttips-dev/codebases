import type BaseItemId from 'owa-service/lib/contract/BaseItemId';
import EventScope from 'owa-service/lib/contract/EventScope';
import itemId from 'owa-service/lib/factory/itemId';
import recurringMasterItemId from 'owa-service/lib/factory/recurringMasterItemId';
import { getCalendarEventWithId } from '../selectors/calendarFolderEventsSelectors';

/**
 * returns the Item Id to be sent to service request
 * @param calendarItemId the given Item ID
 * @param eventScope eventScope for the update. It's null for recurrence master and non-recurrence
 */
export default function getItemIdToUpdate(
    calendarItemId: string,
    eventScope: EventScope
): BaseItemId {
    var idToUpdate: BaseItemId;
    if (eventScope == EventScope.AllInstancesInSeries) {
        const calendarEvent = getCalendarEventWithId(calendarItemId);
        // if the event exists in the cache, try to build the item master ID
        idToUpdate = calendarEvent?.SeriesMasterItemId
            ? itemId({
                  Id: calendarEvent.SeriesMasterItemId.Id,
              })
            : (idToUpdate = recurringMasterItemId({
                  OccurrenceId: calendarItemId,
              }));
    } else {
        idToUpdate = itemId({
            Id: calendarItemId,
        });
    }
    return idToUpdate;
}
