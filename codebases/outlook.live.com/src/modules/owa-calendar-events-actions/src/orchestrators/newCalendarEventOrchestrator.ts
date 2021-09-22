import { calendarNotificationsBarCreateEventFailed } from 'owa-locstrings/lib/strings/calendarnotificationsbarcreateeventfailed.locstring.json';
import loc from 'owa-localize';
import { newCalendarEvent, newCalendarEventCreated } from '../actions/publicActions';
import newCalendarEventService from '../services/newCalendarEventService';
import { returnTopExecutingActionDatapoint } from 'owa-analytics';
import { calendarEvent } from 'owa-calendar-event-converter';
import { instantCalendarEventCreate } from 'owa-calendar-events-store';
import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import type CalendarItem from 'owa-service/lib/contract/CalendarItem';
import { orchestrator } from 'satcheljs';
import { onItemCreatedLocally, onCreateItemFailed } from 'owa-calendar-event-notification-bar';

/**
 * Makes call to server for newCalendarEvent and resets store
 */
orchestrator(newCalendarEvent, async actionMessage => {
    const { event, actionSource, onSuccess, onError } = actionMessage;

    const dataPoint = returnTopExecutingActionDatapoint();
    if (dataPoint) {
        dataPoint.addCustomData({
            isRecurrence: !!event.Recurrence,
        });
    }

    try {
        const eventWithChanges = createEventWithChanges(event);

        let createPromise = new Promise<CalendarEvent>((resolve, reject) => {
            instantCalendarEventCreate(
                eventWithChanges,
                (itemToCreate: CalendarEvent) => {
                    let servicePromise = newCalendarEventService(itemToCreate);
                    if (dataPoint) {
                        dataPoint.markUserPerceivedTime(); // mark user perceived time as soon as we dispatch the request to save
                    }

                    return servicePromise.then(response => {
                        const isSuccessful =
                            response.ResponseClass == 'Success' &&
                            response.Items &&
                            response.Items.length > 0;

                        isSuccessful && newCalendarEventCreated(itemToCreate.ParentFolderId.Id);

                        return {
                            isSuccessful: isSuccessful,
                            createdItem: isSuccessful
                                ? calendarEvent(
                                      response.Items[0] as CalendarItem,
                                      event.ParentFolderId.mailboxInfo
                                  )
                                : null,
                        };
                    });
                },
                resolve,
                (error, retryFunction, actionSource) => {
                    onCreateItemFailed(error, retryFunction, actionSource);
                    reject(error);
                },
                actionSource,
                loc(calendarNotificationsBarCreateEventFailed),
                onItemCreatedLocally
            );
        });

        const createdItem = await createPromise;
        let newItemId = createdItem.ItemId.Id;
        let newItem: CalendarEvent = {
            ...event,
            ItemId: { Id: newItemId, mailboxInfo: createdItem.ParentFolderId.mailboxInfo },
            UID: createdItem.UID,
        };

        onSuccess(newItem);
    } catch (e) {
        onError(e);
        throw e;
    }
});

/**
 * Returns a calendar event with just the changes
 */
function createEventWithChanges(event: CalendarEvent): CalendarEvent {
    let updatedEvent = {} as CalendarEvent;
    updatedEvent.FreeBusyType = event.FreeBusyType;
    updatedEvent.ParentFolderId = event.ParentFolderId;
    updatedEvent.Sensitivity = event.Sensitivity;
    updatedEvent.Subject = event.Subject;
    updatedEvent.Body = event.Body;
    updatedEvent.Start = event.Start;
    updatedEvent.End = event.End;
    updatedEvent.IsAllDayEvent = event.IsAllDayEvent;
    updatedEvent.IsRoomRequested = event.IsRoomRequested;
    updatedEvent.ReminderMinutesBeforeStart = event.ReminderMinutesBeforeStart;
    updatedEvent.ReminderIsSet = event.ReminderIsSet;
    updatedEvent.CharmId = event.CharmId;

    updatedEvent.Resources = event.Resources;
    updatedEvent.Locations = event.Locations;
    updatedEvent.IsDraft = event.IsDraft;
    updatedEvent.DoNotForwardMeeting = event.DoNotForwardMeeting;
    updatedEvent.IsResponseRequested = event.IsResponseRequested;
    updatedEvent.StartTimeZoneId = event.StartTimeZoneId;
    updatedEvent.EndTimeZoneId = event.EndTimeZoneId;
    updatedEvent.HideAttendees = event.HideAttendees;
    updatedEvent.SkypeTeamsProperties = event.SkypeTeamsProperties;
    updatedEvent.AppendOnSend = event.AppendOnSend;
    updatedEvent.IsBookedFreeBlocks = event.IsBookedFreeBlocks;
    updatedEvent.AssociatedTasks = event.AssociatedTasks;
    updatedEvent.CollabSpace = event.CollabSpace;
    updatedEvent.TravelTimeEventsLinked = event.TravelTimeEventsLinked;
    updatedEvent.FlexEventsMetadata = event.FlexEventsMetadata;

    if (event.Recurrence) {
        updatedEvent.Recurrence = event.Recurrence;
    }

    // IsOnlineMeeting and OnlineMeetingProvider properties are not meant to be sent when the event is a draft
    // else they will be wiped by the server when the updateCalendarEvent call is made. Incident 1748647.
    if (event.IsOnlineMeeting) {
        updatedEvent.IsOnlineMeeting = event.IsDraft ? undefined : event.IsOnlineMeeting;
    }

    if (event.OnlineMeetingProvider) {
        updatedEvent.OnlineMeetingProvider = event.IsDraft
            ? undefined
            : event.OnlineMeetingProvider;
    }

    if (event.DocLinks) {
        updatedEvent.DocLinks = event.DocLinks;
    }

    // We need to check for null before accessing length because these props could be null
    // in scenarios where cloneEvent isn't called
    // e.g. when you drag a task from the task pane onto the calendar surface
    if (event.RequiredAttendees && event.RequiredAttendees.length > 0) {
        updatedEvent.RequiredAttendees = event.RequiredAttendees;
    }

    if (event.OptionalAttendees && event.OptionalAttendees.length > 0) {
        updatedEvent.OptionalAttendees = event.OptionalAttendees;
    }

    if (event.InboxReminders && event.InboxReminders.length > 0) {
        updatedEvent.InboxReminders = event.InboxReminders;
    }

    if (event.Categories && event.Categories.length > 0) {
        updatedEvent.Categories = event.Categories;
    }

    return updatedEvent;
}
