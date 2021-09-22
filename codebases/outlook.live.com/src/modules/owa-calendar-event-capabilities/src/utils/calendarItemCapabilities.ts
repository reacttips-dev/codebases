import { areAnyTXPEntitiesSupported } from 'owa-txp-common';
import type { CalendarEvent } from 'owa-calendar-types';
import CalendarFolderTypeEnum from 'owa-service/lib/contract/CalendarFolderTypeEnum';
import canDeleteAsAttendee from './canDeleteAsAttendee';
import canDeleteAsNonOrganizerAppointment from './canDeleteAsNonOrganizerAppointment';
import canDeleteAsOrganizer from './canDeleteAsOrganizer';
import { getUserConfiguration } from 'owa-session-store';
import WebSessionType from 'owa-service/lib/contract/WebSessionType';
import { getCalendarEntryByFolderId } from 'owa-calendar-cache';
import { toCalendarItem } from 'owa-calendar-event-converter';
import { isEventAMeeting, isOnGroupCalendar, canModify } from '../index';

/**
 * Returns true if the event is forward-able, false otherwise.
 * One exception is 'Do not forward' flag.  When Do not forward is set, the spec'ed behavior
 * is to show the forward option and disable it.  So, we return true if do-not-forward is set
 * @param item The event
 */
export function canForward(item: CalendarEvent): boolean {
    const calendarEntry = getCalendarEntryByFolderId(item.ParentFolderId.Id);
    const calendarItem = toCalendarItem(item);

    return (
        canModify(item) &&
        isEventAMeeting(item) &&
        !!calendarEntry &&
        !!calendarItem &&
        !(
            [
                CalendarFolderTypeEnum.BirthdayCalendar,
                CalendarFolderTypeEnum.BookingCalendar,
                CalendarFolderTypeEnum.SchedulesCalendar,
            ].includes(calendarEntry.CalendarFolderType) || calendarItem.IsMeetingPollEvent
        )
    );
}

/**
 * Returns true if the user has permission to cancel this event
 */
export function canCancel(item: CalendarEvent): boolean {
    return !!(item.IsOrganizer && item.IsMeeting && item.MeetingRequestWasSent && canModify(item));
}

/**
 * Determines if the delete button is to be shown
 * @param item Subject item
 */
export const canDelete = (item: CalendarEvent): boolean =>
    canDeleteAsOrganizer(item) ||
    canDeleteAsAttendee(item) ||
    canDeleteAsNonOrganizerAppointment(item);

/**
 * Returns true if the user can respond to this event
 */
export function canRespond(item: CalendarEvent): boolean {
    return (
        !isOnGroupCalendar(item) &&
        !item.IsOrganizer &&
        item.IsMeeting &&
        !item.IsCancelled &&
        canModify(item)
    );
}

/**
 * Returns true if the user can propose a new time for this event
 */
export function canProposeTime(item: CalendarEvent) {
    return (
        getUserConfiguration().SessionSettings.WebSessionType == WebSessionType.Business &&
        canRespond(item) &&
        item.IsResponseRequested &&
        !item.IsAllDayEvent &&
        (!item.IsRecurring || isSeriesInstance(item))
    );
}

/**
 * Returns true if the user can remove this item from their calendar
 */
export function canRemove(item: CalendarEvent): boolean {
    return !item.IsOrganizer && item.IsCancelled && canModify(item);
}

/**
 * Returns true if the user can open a compose form for this meeting
 */
export function canEdit(item: CalendarEvent): boolean {
    const isTxpEventFlag = areAnyTXPEntitiesSupported(item.EntityNamesMap);
    return !isTxpEventFlag && item.IsOrganizer && canModify(item);
}

/**
 * Returns true if the event is part of a series but not the master
 */
export function isSeriesInstance(event: CalendarEvent): boolean {
    return (
        event.IsRecurring &&
        event.CalendarItemType !== 'RecurringMaster' &&
        event.CalendarItemType !== 'ThisAndFollowingInstancesMaster'
    );
}

/**
 * Returns true if the event is the master of a recurrence
 * @param event calendar event
 */
export function isSeriesMaster(event: CalendarEvent): boolean {
    return event.CalendarItemType === 'RecurringMaster';
}

/**
 * Returns true if the event is a special series master for
 * ThisAndFollowingInstances scope
 * @param event calendar event
 */
export function isFTDFSeriesMaster(event: CalendarEvent): boolean {
    return event.CalendarItemType === 'ThisAndFollowingInstancesMaster';
}

/**
 * Determines if add to my calendar action should be shown
 * @param event Calendar event object
 */
export function canAddToMyCalendar(event: CalendarEvent): boolean {
    return isOnGroupCalendar(event) && !event.IsCancelled && !event.DoNotForwardMeeting;
}
