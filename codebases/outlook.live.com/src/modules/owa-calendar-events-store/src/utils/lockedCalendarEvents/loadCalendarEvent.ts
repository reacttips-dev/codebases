import { loadCalendarEvent as loadCalendarEventService } from 'owa-calendar-services/lib/services/loadCalendarEvent';
import { getBirthdayEventService } from 'owa-calendar-services/lib/services/getBirthdayEventService';
import { CalendarEventItemResponseShapeType } from 'owa-calendar-services/lib/schema/CalendarEventItemResponseShapeType';
import { CalendarEntry } from 'owa-graph-schema';
import { getCalendarEntryByFolderId, isTeamsCalendarEntry } from 'owa-calendar-cache';
import { getLongestLockedDateRange } from '../../selectors/eventsCacheSelectors';
import type { ClientItemId } from 'owa-client-ids';
import { calendarEvent, calendarEventFromBirthdayEvent } from 'owa-calendar-event-converter';
import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import { getApolloClient } from 'owa-apollo';
import { isFeatureEnabled } from 'owa-feature-flags';
import { FullCalendarEventDocument } from 'owa-calendar-events-graphql-documents/lib/graphql/__generated__/FullCalendarEventQuery.interface';
import { FullBirthdayCalendarEventDocument } from 'owa-calendar-events-graphql-documents/lib/graphql/__generated__/FullBirthdayCalendarEventQuery.interface';
import { getISOString } from 'owa-datetime';
import { mapGqlCalendarEventToOwaCalendarEvent } from '../mapGqlCalendarEventToOwaCalendarEvent';
import CalendarFolderTypeEnum from 'owa-service/lib/contract/CalendarFolderTypeEnum';

export interface LoadCalendarEventResponse {
    error?: string;
    responseCode?: string;
    calendarEvent?: CalendarEvent;
}

export async function loadCalendarEvent(
    itemId: ClientItemId,
    parentFolderId: string,
    itemResponseShapeType: CalendarEventItemResponseShapeType,
    fetchMasterItemFromOccurence: boolean = false
): Promise<LoadCalendarEventResponse> {
    if (isFeatureEnabled('mon-cal-loadEventsViaGql')) {
        return loadCalendarEventV2(
            itemId,
            parentFolderId,
            itemResponseShapeType,
            fetchMasterItemFromOccurence
        );
    }
    const calendarEntry: CalendarEntry = getCalendarEntryByFolderId(parentFolderId);
    const isBirthdayCalendarEvent =
        calendarEntry &&
        calendarEntry.CalendarFolderType == CalendarFolderTypeEnum.BirthdayCalendar;
    let response;
    if (!isBirthdayCalendarEvent) {
        const isTeamsCalendarEvent = isTeamsCalendarEntry(calendarEntry);
        response = await loadCalendarEventService(
            itemId,
            isTeamsCalendarEvent ? parentFolderId : undefined,
            itemResponseShapeType,
            fetchMasterItemFromOccurence
        );
        if (response.calendarEvent) {
            response.calendarEvent = calendarEvent(response.calendarEvent, itemId.mailboxInfo);
        }
        return response;
    } else {
        const dateRange = getLongestLockedDateRange(parentFolderId);
        response = await getBirthdayEventService(itemId);
        if (response.calendarEvent) {
            return {
                ...response,
                calendarEvent: calendarEventFromBirthdayEvent(
                    response.calendarEvent,
                    parentFolderId,
                    dateRange,
                    itemId.mailboxInfo
                ),
            };
        }
        return response;
    }
}

async function loadCalendarEventV2(
    itemId: ClientItemId,
    parentFolderId: string,
    itemResponseShapeType: CalendarEventItemResponseShapeType,
    fetchMasterItemFromOccurence: boolean = false
): Promise<LoadCalendarEventResponse> {
    const calendarEntry: CalendarEntry = getCalendarEntryByFolderId(parentFolderId);
    const isBirthdayCalendarEvent =
        calendarEntry &&
        calendarEntry.CalendarFolderType == CalendarFolderTypeEnum.BirthdayCalendar;
    if (!isBirthdayCalendarEvent) {
        const isTeamsCalendarEvent = isTeamsCalendarEntry(calendarEntry);
        const client = getApolloClient();
        const results = await client.query({
            query: FullCalendarEventDocument,
            variables: {
                input: {
                    id: {
                        mailboxInfo: itemId.mailboxInfo,
                        Id: itemId.Id,
                        ChangeKey: itemId.ChangeKey,
                    },
                    parentFolderId: isTeamsCalendarEvent ? parentFolderId : undefined,
                    shape: itemResponseShapeType,
                    fetchMasterItemFromOccurence: fetchMasterItemFromOccurence,
                },
            },
        });
        return {
            ...results.data.fullCalendarEvent,
            calendarEvent: mapGqlCalendarEventToOwaCalendarEvent(
                results.data.fullCalendarEvent.calendarEvent
            ),
        };
    } else {
        const dateRange = getLongestLockedDateRange(parentFolderId);
        const client = getApolloClient();
        const results = await client.query({
            query: FullBirthdayCalendarEventDocument,
            variables: {
                input: {
                    id: itemId,
                    parentFolderId: parentFolderId,
                    dateRange: {
                        start: getISOString(dateRange.start),
                        end: getISOString(dateRange.end),
                    },
                },
            },
        });
        return {
            ...results.data.fullBirthdayCalendarEvent,
            calendarEvent: mapGqlCalendarEventToOwaCalendarEvent(
                results.data.fullBirthdayCalendarEvent.calendarEvent
            ),
        };
    }
}
