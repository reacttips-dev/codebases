import type BusyType from 'owa-service/lib/contract/BusyType';
import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import type CalendarTime from 'owa-calendar-types/lib/types/CalendarTime';
import EventScope from 'owa-service/lib/contract/EventScope';
import type ResponseTypeType from 'owa-service/lib/contract/ResponseTypeType';
import type ShareTailoredExperienceEventRequest from 'owa-service/lib/contract/ShareTailoredExperienceEventRequest';
import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';
import type { ClientItemId } from 'owa-client-ids';
import type { ViewType } from 'owa-calendar-actions';
import getEventScopeStringForTelemetry from '../utils/getEventScopeStringForTelemetry';
import getEventLocationDetailsForTelemetry from '../utils/getEventLocationDetailsForTelemetry';
import type { CalendarComponent } from 'owa-calendar-usage-instrumentation';

export const addCalendarEventToMyCalendar = action(
    'ADD_CALENDAR_EVENT_TO_MY_CALENDAR',
    (itemId: ClientItemId, actionSource: ViewType, addSeries: boolean = false) =>
        addDatapointConfig(
            {
                name: 'addToMyCalendar',
                customData: { ActionSource: actionSource },
            },
            {
                itemId,
                actionSource,
                addSeries,
            }
        )
);

export const cancelCalendarEvent = action(
    'CANCEL_CALENDAR_EVENT',
    (
        itemId: ClientItemId,
        actionSource: ViewType,
        eventScope: EventScope,
        component: CalendarComponent,
        cancellationMessage?: string,
        onCancellationSent?: () => void
    ) =>
        addDatapointConfig(
            {
                name: 'CancelEvent',
                customData: {
                    actionSource: actionSource,
                    eventScope: getEventScopeStringForTelemetry(eventScope),
                    component: component,
                },
            },
            {
                itemId,
                actionSource,
                eventScope,
                cancellationMessage,
                onCancellationSent,
            }
        )
);

export const deleteCalendarEvent = action(
    'DELETE_CALENDAR_EVENT',
    (
        item: CalendarEvent,
        actionSource: ViewType,
        eventScope: EventScope = EventScope.Default,
        onDelete?: () => void
    ) =>
        addDatapointConfig(
            {
                name: 'DeleteEvent',
                customData: {
                    actionSource: actionSource,
                    eventScope: getEventScopeStringForTelemetry(eventScope),
                },
                options: { isCore: true },
            },
            {
                item,
                actionSource,
                eventScope,
                onDelete,
            }
        )
);

export const respondToCalendarEvent = action(
    'RESPOND_TO_CALENDAR_EVENT',
    (
        itemId: ClientItemId,
        currentResponseType: ResponseTypeType,
        newResponseType: ResponseTypeType,
        currentFreeBusyType: BusyType,
        eventScope: EventScope,
        sendResponse: boolean,
        actionSource: ViewType,
        responseMessage?: string,
        proposeNewTime?: CalendarTime,
        showingDeclinedEvents?: boolean,
        meetingMessageId?: string,
        skipLoggingDatapoint?: boolean
    ) => {
        const params = {
            itemId,
            currentResponseType,
            newResponseType,
            currentFreeBusyType,
            eventScope,
            sendResponse,
            actionSource,
            responseMessage,
            proposeNewTime,
            showingDeclinedEvents,
            meetingMessageId,
            skipLoggingDatapoint,
        };
        if (skipLoggingDatapoint) {
            return params;
        } else {
            return addDatapointConfig(
                { name: 'RespondToEvent', options: { isCore: true } },
                params
            );
        }
    }
);

export const updateCalendarEvent = action(
    'UPDATE_CALENDAR_EVENT',
    (
        event: CalendarEvent,
        calendarItemUpdates: CalendarEvent,
        actionSource: ViewType,
        eventScope: EventScope = EventScope.Default,
        onSuccess: () => void = () => {},
        onError: (error: Error) => void = () => {},
        showNotification: boolean = false,
        updateAsCoOrganizer: boolean = false
    ) =>
        addDatapointConfig(
            {
                name: 'UpdateEvent',
            },
            {
                event,
                calendarItemUpdates,
                actionSource,
                eventScope,
                onSuccess,
                onError,
                showNotification,
                updateAsCoOrganizer,
            }
        )
);

export const newCalendarEvent = action(
    'NEW_CALENDAR_EVENT',
    (
        event: CalendarEvent,
        actionSource: ViewType,
        onSuccess: (event: CalendarEvent) => void = () => {},
        onError: (error: Error) => void = () => {}
    ) =>
        addDatapointConfig(
            {
                name: 'CreateEvent',
                customData: getEventLocationDetailsForTelemetry(event),
            },
            {
                event,
                actionSource,
                onSuccess,
                onError,
            }
        )
);

export const shareTxpCalendarEvent = action(
    'SHARE_TXP_CALENDAR_EVENT',
    (
        itemId: ClientItemId,
        requestBody: Pick<ShareTailoredExperienceEventRequest, 'RecipientEmailAddresses' | 'Note'>,
        actionSource: ViewType,
        isOrganizer: boolean,
        isMeeting: boolean,
        onSuccess: () => void = () => {},
        onError: (error: Error) => void = () => {}
    ) => ({
        itemId,
        requestBody,
        actionSource,
        isOrganizer,
        isMeeting,
        onSuccess,
        onError,
    })
);

/**
 * Called when a new calendar event was successfully created.
 * @param parentFolderId The id of the parentFolderId of the event.
 */
export const newCalendarEventCreated = action(
    'selectCalendarFromEvent',
    (parentFolderId: string) => ({
        parentFolderId,
    })
);
