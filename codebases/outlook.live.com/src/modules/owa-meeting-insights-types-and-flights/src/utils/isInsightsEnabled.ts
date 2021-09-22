import { getCalendarEntryByFolderId } from 'owa-calendar-cache';
import { isMeetingOnCalendarSharedWithMe } from 'owa-calendar-event-capabilities';
import { getCalendarEventWithId } from 'owa-calendar-events-store';
import ReminderGroupTypes from 'owa-service/lib/contract/ReminderGroupTypes';
import { isConsumer } from 'owa-session-store';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export function isInsightsEnabledForUser(): boolean {
    // Insights is enabled for user if
    // - IsSubstrateSearchServiceAvailable is true
    // - user is not consumer
    return (
        getUserConfiguration().SessionSettings.IsSubstrateSearchServiceAvailable && !isConsumer()
    );
}

export function isInsightsEnabledForEvent(itemId: string): boolean {
    if (!isInsightsEnabledForUser()) {
        return false;
    }

    const event = getCalendarEventWithId(itemId);
    if (!event) {
        // No need to fetch if event is not in client cache
        return false;
    }

    const isMeeting = !!event.IsMeeting;
    const folderId = event.ParentFolderId.Id;
    const calendarEntry = getCalendarEntryByFolderId(folderId);

    if (calendarEntry) {
        // Insights is enabled for event if
        // - event is a meeting
        // - event is not on a group calendar
        // - event is on a calendar of the user's self mailbox
        return (
            isMeeting &&
            !calendarEntry.IsGroupMailboxCalendar &&
            !isMeetingOnCalendarSharedWithMe(event)
        );
    } else {
        // If we don't know which calendar the event is on, make the best guess by only checking meeting
        return isMeeting;
    }
}

export function isInsightsInReminderEnabled(reminderType: ReminderGroupTypes): boolean {
    return reminderType == ReminderGroupTypes.Calendar && isInsightsEnabledForUser();
}
