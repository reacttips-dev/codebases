import itemId from 'owa-service/lib/factory/itemId';
import recurringMasterItemId from 'owa-service/lib/factory/recurringMasterItemId';
import type { ClientItemId } from 'owa-client-ids';
import { getCalendarEventService } from './getCalendarEventService';
import { GetCalendarEventResponse } from '../schema/GetCalendarEventResponse';
import { CalendarEventItemResponseShapeType } from '../schema/CalendarEventItemResponseShapeType';
import { getItemResponseShape } from '../utils/getItemResponseShape';

/**
 * Loads the calendar event from the server based on item id
 * @param id id of the event that we want to load
 * @param getSeriesMaster flag which says whether we want series master or series instance
 */
export function loadCalendarEvent(
    id: ClientItemId,
    parentFolderId?: string,
    shapeType?: CalendarEventItemResponseShapeType,
    fetchMasterItemFromOccurence?: boolean
): Promise<GetCalendarEventResponse> {
    const eventIds = [
        fetchMasterItemFromOccurence
            ? recurringMasterItemId({ OccurrenceId: id.Id })
            : itemId({ Id: id.Id }), // special case fetching the series master with the occurence id This will break (how it is currently ) for declined events
    ];
    return getCalendarEventService(
        id,
        getItemResponseShape(shapeType),
        fetchMasterItemFromOccurence,
        eventIds,
        parentFolderId
    );
}
