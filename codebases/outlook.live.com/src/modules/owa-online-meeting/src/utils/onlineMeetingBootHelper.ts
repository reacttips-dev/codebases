// This file is imported in the boot package and only necessary and related helpers should be included here
import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import { isEventHappeningNow } from 'owa-datetime-utils';
import { observableNow } from 'owa-observable-datetime';
import { subMinutes, OwaDate } from 'owa-datetime';

const MINS_TO_SHOW_JOIN_BUTTON_SURFACE = 5;

export function isValidOnlineMeeting(item: CalendarEvent, isSurfaceJoinButton?: boolean) {
    if (!isSurfaceJoinButton) {
        // Skip checking OnlineMeetingJoinUrl as it is not returned correctly from CalendarView REST call
        // https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/62403
        return !item.IsCancelled && item.IsOnlineMeeting;
    } else {
        return (
            !item.IsCancelled &&
            item.IsOnlineMeeting != undefined &&
            item.IsOnlineMeeting &&
            item.OnlineMeetingJoinUrl != undefined &&
            item.OnlineMeetingJoinUrl != ''
        );
    }
}

export function isEventJoinableNow(item: CalendarEvent): boolean {
    return (
        isEventHappeningNowHelper(item.Start, item.End) && isValidOnlineMeeting(item, true) // True indicates it's for the Surface Join button. TODO remove true after WI 62403 is completed
    );
}

export function isEventHappeningNowHelper(start: OwaDate, end: OwaDate): boolean {
    return isEventHappeningNow(
        observableNow(),
        subMinutes(start, MINS_TO_SHOW_JOIN_BUTTON_SURFACE),
        end
    );
}
