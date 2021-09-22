import { calendarNotificationsBarUpdateEventFailed } from 'owa-locstrings/lib/strings/calendarnotificationsbarupdateeventfailed.locstring.json';
import loc from 'owa-localize';
import { updateCalendarEvent } from '../actions/publicActions';
import getUpdateForProperty from '../utils/getUpdateForProperty';
import { returnTopExecutingActionDatapoint, PerformanceDatapoint } from 'owa-analytics';
import { userInteractionAction } from 'owa-calendar-actions';
import { isBirthdayEvent } from 'owa-calendar-event-capabilities';
import { instantCalendarEventUpdate } from 'owa-calendar-events-store';
import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import type PropertyUri from 'owa-service/lib/contract/PropertyUri';
import { getUserTimeZone } from 'owa-session-store';
import { orchestrator } from 'satcheljs';
import moveCalendarEventService from '../services/moveCalendarEventService';
import updateBirthdayEventService from '../services/updateBirthdayEventService';
import updateCalendarEventService from '../services/updateCalendarEventService';
import { findInArray } from 'owa-calendar-data-utils/lib/findInArray';
import type { ClientItemId } from 'owa-client-ids';
import type BaseItemId from 'owa-service/lib/contract/BaseItemId';
import type DeleteItemField from 'owa-service/lib/contract/DeleteItemField';
import type EventScope from 'owa-service/lib/contract/EventScope';
import type InboxReminderType from 'owa-service/lib/contract/InboxReminderType';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type ResponseClass from 'owa-service/lib/contract/ResponseClass';
import type SetItemField from 'owa-service/lib/contract/SetItemField';
import itemChange from 'owa-service/lib/factory/itemChange';
import { onItemUpdatedLocally, onUpdateEventFailed } from 'owa-calendar-event-notification-bar';
import { lazyUpdateEventTravelBookends } from 'owa-mobility-common';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * The action worker which handles updating a calendar event.
 */
orchestrator(updateCalendarEvent, async actionMessage => {
    const {
        event,
        calendarItemUpdates,
        actionSource,
        eventScope,
        onSuccess,
        onError,
        showNotification,
        updateAsCoOrganizer,
    } = actionMessage;

    if (!calendarItemUpdates) {
        onSuccess();
        return;
    }

    const isBirthdayCalendarEvent = isBirthdayEvent(event);
    const dataPoint = returnTopExecutingActionDatapoint();
    if (dataPoint) {
        dataPoint.addCustomData({
            updateRecurrence:
                (eventScope && (!!calendarItemUpdates.Start || !!calendarItemUpdates.End)) ||
                !!calendarItemUpdates.Recurrence,
            isBirthdayEvent: isBirthdayCalendarEvent,
        });
    }

    try {
        // Get the new time zones. Fall back to calendarEvent in case they are not being changed now.
        const startTimeZoneId = calendarItemUpdates.StartTimeZoneId || event.StartTimeZoneId;
        const endTimeZoneId = calendarItemUpdates.EndTimeZoneId || event.EndTimeZoneId;

        // TimeZoneId represents the time zone set in the headers.
        const headerTimeZoneId = isBirthdayCalendarEvent ? getUserTimeZone() : startTimeZoneId;

        const updates = Object.keys(calendarItemUpdates)
            .map((key: keyof CalendarEvent) =>
                getUpdateForProperty(
                    key,
                    calendarItemUpdates[key],
                    // End time should be relative to EndTimeZoneId.
                    // All other time values (Start, Recurrence, Reminders) should be relative to the headers TZ
                    key === 'End' ? endTimeZoneId : headerTimeZoneId
                )
            )
            .filter(update => !!update);

        userInteractionAction(
            'EventEdited',
            actionSource,
            event.IsOrganizer,
            event.IsMeeting,
            updates.map(p => (p.Path as PropertyUri).FieldURI)
        );

        const actionToExecute = isBirthdayCalendarEvent
            ? getBirthdayItemUpdateAction(dataPoint, event.ItemId, updates)
            : getCalendarItemUpdateAction(
                  headerTimeZoneId,
                  dataPoint,
                  event.ItemId,
                  eventScope,
                  calendarItemUpdates,
                  updates,
                  updateAsCoOrganizer
              );

        await new Promise<void>((resolve, reject) => {
            instantCalendarEventUpdate(
                event.ItemId,
                calendarItemUpdates,
                eventScope,
                actionToExecute,
                resolve,
                (error, retryFunction, actionSource) => {
                    onUpdateEventFailed(error, retryFunction, actionSource);
                    reject(error);
                },
                actionSource,
                loc(calendarNotificationsBarUpdateEventFailed),
                showNotification ? () => onItemUpdatedLocally(event, actionSource) : () => {}
            );
        });

        if (isFeatureEnabled('cal-mf-mobility')) {
            lazyUpdateEventTravelBookends.importAndExecute(event, calendarItemUpdates);
        }

        onSuccess();
    } catch (e) {
        onError(e);
        throw e;
    }
});

function getCalendarItemUpdateAction(
    headerTimeZoneId: string,
    dataPoint: PerformanceDatapoint,
    itemId: ClientItemId,
    eventScope: EventScope,
    calendarItemUpdates: CalendarEvent,
    updates: (SetItemField | DeleteItemField)[],
    updateAsCoOrganizer: boolean
) {
    const haveAttachmentsChanged = !!calendarItemUpdates.Attachments;
    const onUpdateAction = async (itemIdToUpdate: BaseItemId) => {
        const responseStatusSuccess: ResponseClass = 'Success';
        let updateItemId = itemIdToUpdate;

        if (dataPoint) {
            dataPoint.markUserPerceivedTime(); // Mark user perceived time as soon as we dispatch the update request
        }

        if (calendarItemUpdates.ParentFolderId) {
            const moveItemResponse = await moveCalendarEventService(
                itemId,
                calendarItemUpdates.ParentFolderId
            );
            if (
                moveItemResponse?.ResponseClass != responseStatusSuccess ||
                moveItemResponse?.Items?.length == 0
            ) {
                return {
                    isSuccessful: false,
                };
            } else {
                updateItemId = moveItemResponse?.Items
                    ? moveItemResponse?.Items[0]?.ItemId
                    : itemIdToUpdate;
            }
        }

        if (updates.length || haveAttachmentsChanged) {
            const shouldSendUpdateToAttendees = haveAttachmentsChanged;
            const response = await updateCalendarEventService(
                headerTimeZoneId,
                updateItemId,
                itemId.mailboxInfo,
                itemChange({ Updates: updates, ItemId: updateItemId }),
                eventScope,
                shouldSendUpdateToAttendees,
                updateAsCoOrganizer
            );
            return {
                isSuccessful:
                    response.ResponseClass == responseStatusSuccess && response.Items.length > 0,
            };
        }

        return {
            isSuccessful: true,
        };
    };

    return onUpdateAction;
}

function getBirthdayItemUpdateAction(
    dataPoint: PerformanceDatapoint,
    itemId: ClientItemId,
    updates: (SetItemField | DeleteItemField)[]
) {
    const onUpdateAction = async (itemIdToUpdate: ItemId) => {
        const responseStatusSuccess: ResponseClass = 'Success';
        if (dataPoint) {
            dataPoint.markUserPerceivedTime(); // Mark user perceived time as soon as we dispatch the update request
        }

        const reminderIsSetFindResult = findInArray(
            updates,
            p => (p.Path as PropertyUri).FieldURI == 'ReminderIsSet'
        );

        let reminderIsSetValue: boolean;
        if (reminderIsSetFindResult) {
            reminderIsSetValue = (updates[reminderIsSetFindResult.index] as SetItemField).Item
                .ReminderIsSet;
        }

        const reminderMinutesBeforeStartFindResult = findInArray(
            updates,
            p => (p.Path as PropertyUri).FieldURI == 'ReminderMinutesBeforeStart'
        );

        let reminderMinutesBeforeStartValue: number;
        if (reminderMinutesBeforeStartFindResult) {
            reminderMinutesBeforeStartValue = (updates[
                reminderMinutesBeforeStartFindResult.index
            ] as SetItemField).Item.ReminderMinutesBeforeStart;
        }

        const inboxRemindersFindResult = findInArray(
            updates,
            p => (p.Path as PropertyUri).FieldURI == 'InboxReminders'
        );

        let inboxRemindersValue: InboxReminderType[];
        if (inboxRemindersFindResult) {
            inboxRemindersValue =
                (inboxRemindersFindResult.item as any)?.Item?.InboxReminders ?? null; // if Item field does not exist (which is the case for DeleteItemField - when all email reminders are deleted, then we want to pass "null" value in service call)
        }

        if (
            updates.length > 0 &&
            ((reminderIsSetFindResult && reminderMinutesBeforeStartFindResult) ||
                inboxRemindersFindResult)
        ) {
            const response = await updateBirthdayEventService(
                itemIdToUpdate,
                itemId.mailboxInfo,
                reminderIsSetFindResult && reminderMinutesBeforeStartFindResult
                    ? {
                          IsReminderSet: reminderIsSetValue,
                          ReminderMinutesBeforeStart: reminderMinutesBeforeStartValue,
                      }
                    : undefined,
                inboxRemindersValue
            );
            return {
                isSuccessful:
                    response.ResponseClass == responseStatusSuccess &&
                    response.BirthdayEvent != null,
            };
        }

        return {
            isSuccessful: true,
        };
    };

    return onUpdateAction;
}
