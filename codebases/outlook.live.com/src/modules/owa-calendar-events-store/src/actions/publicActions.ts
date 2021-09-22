import { calendarNotificationsBarUpdateEventFailed } from 'owa-locstrings/lib/strings/calendarnotificationsbarupdateeventfailed.locstring.json';
import { calendarNotificationsBarCreateEventFailed } from 'owa-locstrings/lib/strings/calendarnotificationsbarcreateeventfailed.locstring.json';
import { calendarNotificationsBarDeleteEventFailed } from 'owa-locstrings/lib/strings/calendarnotificationsbardeleteeventfailed.locstring.json';
import loc from 'owa-localize';
import type { CalendarEventsLoadingState } from '../types/CalendarEventsLoadingState';
import type { PerformanceDatapoint } from 'owa-analytics';
import { addDatapointConfig } from 'owa-analytics-actions';
import type { ViewType } from 'owa-calendar-actions';
import type { CalendarId } from 'owa-graph-schema';
import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import type { ClientItemId } from 'owa-client-ids';
import type BaseItemId from 'owa-service/lib/contract/BaseItemId';
import type EventScope from 'owa-service/lib/contract/EventScope';
import type { CalendarEventEntity } from '../store/schema/CalendarEventEntity';
import { action } from 'satcheljs';

/**
 * All new consumers of this action should not reference the `eventsRemoved` parameter in the message,
 * since this is an anti-pattern and is slated for deprecation. Instead, select and filter events of
 * interest from the cache via a locked store rather than storing your own array of calendar events.
 */
export const calendarEventsRemoved = action(
    'calendarEventsRemoved',
    (eventsRemoved: ReadonlyArray<Readonly<CalendarEvent>>) => ({
        eventsRemoved,
    })
);

/**
 * All new consumers of this action should not reference the `eventsAdded` parameter in the message,
 * since this is an anti-pattern and is slated for deprecation. Instead, select and filter events of
 * interest from the cache via a locked store rather than storing your own array of calendar events.
 */
export const calendarEventsAdded = action(
    'calendarEventsAdded',
    (eventsAdded: ReadonlyArray<Readonly<CalendarEvent>>) => ({
        eventsAdded,
    })
);

/**
 * All new consumers of this action should not reference the `eventUpdated` parameter in the message,
 * since this is an anti-pattern and is slated for deprecation. Instead, select and filter events of
 * interest from the cache via a locked store rather than storing your own array of calendar events.
 */
export const calendarEventUpdated = action(
    'calendarEventUpdated',
    (eventUpdated: Readonly<CalendarEvent>) => ({
        eventUpdated,
    })
);

/**
 * DO NOT USE!
 * Only intended as a temporary stopgap to address VSO bug #34245 and will be removed as part of VSO work item #30430
 */
export const calendarEventsRemovedMatchingFilter = action(
    'calendarEventsRemovedMatchedFilter',
    (removePredicate: (event: CalendarEvent) => boolean) => ({
        removePredicate,
    })
);

export const cacheReloaded = action(
    'cacheReloaded',
    (
        previousEvents: ReadonlyArray<Readonly<CalendarEvent>>,
        reloadedEvents: ReadonlyArray<Readonly<CalendarEvent>>
    ) => ({
        previousEvents,
        reloadedEvents,
    })
);

/**
 * Deletes the event cache for a particular folder.
 *
 * This should be called only in cases where calendars are removed or deleted, as it removes the events for all
 * cache consumers.
 */
export const deleteEventsCache = action('deleteEventsCache', (folderId: string) => ({ folderId }));

/**
 * This action is dispatched when the load state of calendar events for a calendar changes.
 * This is a subscribable public action, consumers can listen to this action if need be, but they should not call it themselves.
 * @param calendarId the calendarId with the changed load state
 * @param loadingState the new load state of the calendar events
 */
export const loadingCalendarEvents = action(
    'loadingCalendarEvents',
    (lockId: string, calendarId: CalendarId, loadingState: CalendarEventsLoadingState) =>
        addDatapointConfig(
            {
                name: 'CalendarLoadState',
                customData: {
                    loadingState,
                },
                options: {
                    isVerbose: true,
                },
            },
            {
                lockId,
                calendarId,
                loadingState,
            }
        )
);

/**
 * Calendar item operation result
 */
export interface CalendarEventOperationResult {
    isSuccessful: boolean;
}

/**
 * Create operation result
 */
export interface CalendarEventCreateResult extends CalendarEventOperationResult {
    createdItem: CalendarEvent;
}

/**
 * It creates a calendar event locally (local lie) while also sending a request to create
 * the event.
 * @param eventToCreate The event that should be created.
 * @param actionToExecute The action that will be invoked to create calendar event at backend.
 * @param onEventCreatedSuccess Will be called when the event is created successfully at the backend using `actionToExecute`. The created event will be passed to it as param.
 * @param onEventCreatedFailed Will be called if there is an error in creating calendar event.
 * @param actionSource the ViewType from which this action was triggered
 * @param errorMessage The error message to show in case of failure.
 * @param onEventCreatedLocally callback which is triggered when the event is created locally
 */
export const instantCalendarEventCreate = action(
    'instantCalendarEventCreate',
    <T extends CalendarEventCreateResult>(
        eventToCreate: CalendarEvent,
        actionToExecute: (eventToCreate: CalendarEvent) => Promise<T>,
        onEventCreatedSuccess: (instantEvent: CalendarEvent) => void,
        onEventCreatedFailed: (
            error: any,
            retryFunction: () => void | null,
            actionSource: ViewType
        ) => void = () => {},
        actionSource: ViewType = undefined,
        errorMessage: string = loc(calendarNotificationsBarCreateEventFailed),
        onEventCreatedLocally: (actionSource: ViewType) => void = () => {}
    ) => ({
        eventToCreate,
        actionToExecute,
        onEventCreatedSuccess,
        onEventCreatedFailed,
        actionSource,
        errorMessage,
        onEventCreatedLocally,
    })
);

/**
 * It updates the calendar event locally (local lie) while also sending a request to update
 * the event.
 * @param eventId The id of the event to update.
 * @param eventChanges The changes in the event that need to be updated.
 * @param actionToExecute The action that will be invoked to update calendar event at backend.
 * @param onEventUpdateSuccess Will be called when the event is updated successfully at the backend using `actionToExecute`.
 * @param onEventUpdateFailed Will be called if there is an error in updating calendar event.
 * @param actionSource the ViewType from which this action was triggered
 * @param errorMessage The error message to show in case of failure.
 * @param onEventUpdatedLocally called when an event has been upated locally
 */
export const instantCalendarEventUpdate = action(
    'instantCalendarEventUpdate',
    <T extends CalendarEventOperationResult>(
        eventId: ClientItemId,
        eventChanges: CalendarEvent,
        eventScope: EventScope,
        actionToExecute: (idToUpdate: BaseItemId) => Promise<T>,
        onEventUpdateSuccess: () => void,
        onEventUpdateFailed: (
            error: any,
            retryFunction: () => void | null,
            actionSource: ViewType
        ) => void = () => {},
        actionSource: ViewType = undefined,
        errorMessage: string = loc(calendarNotificationsBarUpdateEventFailed),
        onEventUpdatedLocally: (event: CalendarEvent, actionSource: ViewType) => void = () => {}
    ) => ({
        eventId,
        eventChanges,
        eventScope,
        actionToExecute,
        onEventUpdateSuccess,
        onEventUpdateFailed,
        actionSource,
        errorMessage,
        onEventUpdatedLocally,
    })
);

/**
 * It deletes the calendar event locally (local lie) while also sending a request to delete
 * the event.
 * @param eventId The id of the event to delete.
 * @param eventToDelete The event that should be deleted.
 * @param dataPoint passed from previous action so that user perceived time can be marked
 * @param actionToExecute The action that will be invoked to delete calendar event at backend.
 * @param onEventDeleteSuccess Will be called when the event is deleted successfully at the backend using `actionToExecute`.
 * @param onEventDeleteFailed Will be called if there is an error in deleting calendar event.
 * @param actionSource the ViewType from which this action was triggered
 * @param errorMessage The error message to show in case of failure.
 * @param responseSent Whether or not the user chose to send a response to the organizer
 * @param asyncUndoAction an undo action that will be awaited before sending the server request to delete the event, if true is returned, the
 * delete is undon locally and the server request to delete is not sent
 */
export const instantCalendarEventDelete = action(
    'instantCalendarEventDelete',
    <T extends CalendarEventOperationResult>(
        eventId: ClientItemId,
        eventScope: EventScope,
        dataPoint: PerformanceDatapoint,
        actionToExecute: (id: BaseItemId) => Promise<T>,
        onEventDeleteSuccess: () => void,
        onEventDeleteFailed: (
            error: any,
            retryFunction: () => void | null,
            actionSource: ViewType
        ) => void = () => {},
        actionSource: ViewType = undefined,
        errorMessage: string = loc(calendarNotificationsBarDeleteEventFailed),
        responseSent: boolean = false,
        asyncUndoAction: (
            eventToDelete: CalendarEventEntity,
            responseSent: boolean,
            actionSource: ViewType
        ) => Promise<boolean> = () => Promise.resolve(false)
    ) => ({
        eventId,
        eventScope,
        dataPoint,
        actionToExecute,
        onEventDeleteSuccess,
        onEventDeleteFailed,
        actionSource,
        errorMessage,
        responseSent,
        asyncUndoAction,
    })
);
