import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import {
    getFullItemLoadState,
    getCurrentOrDefaultFullItemResponseShapeType,
} from '../selectors/fullItemInfoSelectors';
import { loadCalendarEvent } from '../utils/lockedCalendarEvents/loadCalendarEvent';

export async function getExistingFullCalendarEventFromServer(event: CalendarEvent) {
    const folderId = event.ParentFolderId.Id;

    // only get if the item is being maintained as a full item
    if (getFullItemLoadState(event.ItemId.Id) !== null) {
        // load full item and place in cache
        const itemResponseShapeType = getCurrentOrDefaultFullItemResponseShapeType(event.ItemId.Id);
        const { calendarEvent } = await loadCalendarEvent(
            event.ItemId,
            folderId,
            itemResponseShapeType
        );
        return calendarEvent;
    }
    return Promise.resolve(null);
}
