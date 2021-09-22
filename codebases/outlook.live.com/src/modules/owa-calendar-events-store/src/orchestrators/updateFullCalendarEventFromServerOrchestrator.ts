import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import { getCurrentOrDefaultFullItemResponseShapeType } from '../selectors/fullItemInfoSelectors';
import { orchestrator } from 'satcheljs';
import {
    updateFullCalendarEventFromServer,
    fullCalendarEventLoaded,
} from '../actions/eventsCacheActions';
import getEventKey from '../utils/getEventKey';
import { getExistingFullCalendarEventFromServer } from '../utils/getExistingFullCalendarEventFromServer';

/**
 * Updates a full item in the full item cache, if needed after receiving a notification
 */
export const updateFullCalendarEventFromServerOrchestrator = orchestrator(
    updateFullCalendarEventFromServer,
    async actionMessage => {
        const partialCalendarEvent: CalendarEvent = actionMessage.partialCalendarEvent;
        const calendarEvent = await getExistingFullCalendarEventFromServer(partialCalendarEvent);

        // only update the cache if loadCalendarEvent returned a non-null event
        if (calendarEvent) {
            const eventKey = getEventKey(partialCalendarEvent);
            const folderId = partialCalendarEvent.ParentFolderId.Id;

            const itemResponseShapeType = getCurrentOrDefaultFullItemResponseShapeType(
                partialCalendarEvent.ItemId.Id
            );
            fullCalendarEventLoaded(folderId, eventKey, itemResponseShapeType, calendarEvent);
        }
    }
);
