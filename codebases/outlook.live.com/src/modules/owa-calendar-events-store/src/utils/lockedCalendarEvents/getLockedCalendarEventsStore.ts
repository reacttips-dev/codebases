import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import type { DateRange } from 'owa-datetime-utils';
import type { EventsCacheLockId } from 'owa-events-cache';
import { fetchCalendarEventsForDateRange } from './fetchCalendarEventsForDateRange';
import {
    fetchFullCalendarEvent,
    fetchFullSeriesMasterCalendarEventFromEventInstance,
} from './fetchFullCalendarEvent';
import type { LockedCalendarEventsStore } from '../../types/LockedCalendarEventsStore';
import { releaseLock } from '../../actions/eventsCacheActions';
import { subscribeNotifications } from '../CalendarItemNotifications';
import type { FetchFullCalendarEventCustomData } from '../../types/FetchFullCalendarEventCustomData';
import type { ClientItemId } from 'owa-client-ids';
import type { CalendarEventItemResponseShapeType } from 'owa-calendar-services/lib/schema/CalendarEventItemResponseShapeType';
import { getCalendarEventWithId } from '../../selectors/calendarFolderEventsSelectors';

export function getLockedCalendarEventsStore(lockId: EventsCacheLockId): LockedCalendarEventsStore {
    if (!lockId) {
        throw new Error('The lock id should be provided');
    }

    return {
        fetchCalendarEventsForDateRange: (
            folderId: string,
            dateRange: DateRange
        ): {
            fetchPromise: Promise<CalendarEvent[]>;
            enhancedFetchPromise: Promise<Partial<CalendarEvent>[]>;
            events: CalendarEvent[] | null;
        } => {
            const { fetchPromise, enhancedFetchPromise, events } = fetchCalendarEventsForDateRange(
                lockId,
                folderId,
                dateRange
            );
            return {
                fetchPromise: fetchPromise,
                enhancedFetchPromise: enhancedFetchPromise,
                events: events,
            };
        },
        subscribeNotifications: (folderId: string): void => {
            return subscribeNotifications(folderId, lockId);
        },
        fetchFullCalendarEvent: (
            eventId: ClientItemId,
            folderId?: string,
            getExistingCalendarEvent?: (eventId: ClientItemId) => CalendarEvent | null,
            isfetchFullSeriesMasterCalendarEventFromEventInstance?: boolean,
            customData?: FetchFullCalendarEventCustomData
        ): { event: CalendarEvent; fullEventPromise: Promise<CalendarEvent> } => {
            // Try to get the calendarEvent with the id to check if the user is the event organizer
            // If the user is the organizer of the event, request the fullCalendarEvent WithBlockedExternalContent
            // This will bring back the event body with unblocked external images.
            let calendarEvent = getCalendarEventWithId(eventId.Id);
            let {
                event,
                fullEventPromise: fullCalendarEventPromise,
            } = fetchFullCalendarEventInternal(
                lockId,
                eventId,
                folderId,
                getExistingCalendarEvent,
                isfetchFullSeriesMasterCalendarEventFromEventInstance,
                customData,
                calendarEvent?.IsOrganizer ? 'WithBlockedExternalContent' : null
            );

            // In case we failed to get the calendarEvent with "getCalendarEventWithId", we won't know if the user
            // is the organizer until we make the first fetchFullCalendarEvent. So we need to fetch the fullItem again
            // using the "WithBlockedExternalContent" flag so we receive the event body with unblocked external images.
            fullCalendarEventPromise = fullCalendarEventPromise.then(async event => {
                // If the user is the organizer of the event and there are blocked images,
                // we should trust the content and get the event with unblocked images
                if (event.IsOrganizer && event.HasBlockedImages) {
                    let {
                        fullEventPromise: fullEventWithExternalImagesPromise,
                    } = fetchFullCalendarEventInternal(
                        lockId,
                        eventId,
                        folderId,
                        getExistingCalendarEvent,
                        isfetchFullSeriesMasterCalendarEventFromEventInstance,
                        customData,
                        'WithBlockedExternalContent'
                    );
                    event = await fullEventWithExternalImagesPromise;
                }
                return event;
            });
            return { event, fullEventPromise: fullCalendarEventPromise };
        },
        fetchFullCalendarEventAndUpdateItemResponseShapeType: (
            eventId: ClientItemId,
            itemResponseShapeType: CalendarEventItemResponseShapeType,
            folderId?: string,
            getExistingCalendarEvent?: (eventId: ClientItemId) => CalendarEvent | null,
            isfetchFullSeriesMasterCalendarEventFromEventInstance?: boolean,
            customData?: FetchFullCalendarEventCustomData
        ): { event: CalendarEvent; fullEventPromise: Promise<CalendarEvent> } => {
            return fetchFullCalendarEventInternal(
                lockId,
                eventId,
                folderId,
                getExistingCalendarEvent,
                isfetchFullSeriesMasterCalendarEventFromEventInstance,
                customData,
                itemResponseShapeType
            );
        },
        getLockId: () => lockId,
        release: () => releaseLock(lockId),
    };
}

function fetchFullCalendarEventInternal(
    lockId: EventsCacheLockId,
    eventId: ClientItemId,
    folderId?: string,
    getExistingCalendarEvent?: (eventId: ClientItemId) => CalendarEvent | null,
    isfetchFullSeriesMasterCalendarEventFromEventInstance?: boolean,
    customData?: FetchFullCalendarEventCustomData,
    itemResponseShapeType?: CalendarEventItemResponseShapeType
) {
    const promise = isfetchFullSeriesMasterCalendarEventFromEventInstance
        ? fetchFullSeriesMasterCalendarEventFromEventInstance(
              lockId,
              eventId,
              folderId,
              getExistingCalendarEvent /* getExistingCalendarEvent */,
              customData,
              itemResponseShapeType
          )
        : fetchFullCalendarEvent(
              lockId,
              eventId,
              folderId,
              getExistingCalendarEvent /* getExistingCalendarEvent */,
              customData,
              itemResponseShapeType
          );
    return promise;
}
