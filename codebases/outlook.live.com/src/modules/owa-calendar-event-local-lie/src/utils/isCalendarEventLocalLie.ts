import type { CalendarEvent } from 'owa-calendar-types';

/**
 * Returns true if this item is currently in the process of being created.
 * We check properties applied via utils in `applyLocalLiePropertiesToEvents` to
 * determine if the event is a local lie.
 * We prevent operations such as opening the peek or compose when an item
 * is being created.
 * @param item The calendar item
 */
export function isCalendarEventLocalLie(item: CalendarEvent): boolean {
    if (item?.ItemId?.Id) {
        let tempItemId = item.ClientSeriesId;
        return (
            !!tempItemId &&
            (item.IsRecurring ? tempItemId == item.InstanceKey : tempItemId == item.ItemId.Id)
        );
    } else {
        return true;
    }
}
