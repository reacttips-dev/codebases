import { lazyShowCalendarNotification } from 'owa-calendar-notification-bar';
import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import { ControlIcons } from 'owa-control-icons';
import loc from 'owa-localize';
import {
    calendarNotificationsBarUpdateMeeting,
    calendarNotificationsBarUpdateEvent,
} from './instantCalendarEventUpdateOrchestrator.locstring.json';
import type { ViewType } from 'owa-calendar-actions';

export function onItemUpdatedLocally(event: CalendarEvent, actionSource: ViewType) {
    const isMeetingUpdate =
        event.IsMeeting || event.RequiredAttendees.length > 0 || event.OptionalAttendees.length > 0;
    const notificationMessage = isMeetingUpdate
        ? loc(calendarNotificationsBarUpdateMeeting)
        : loc(calendarNotificationsBarUpdateEvent);
    const notificationButtonOptions = {
        icon: isMeetingUpdate ? ControlIcons.Send : ControlIcons.Save,
    };

    // setTimeout is to allow for any open forms to have time to close before attempting to show the notification
    setTimeout(() => {
        lazyShowCalendarNotification.import().then(showCalendarNotification => {
            showCalendarNotification(
                'instantCalendarEventUpdate',
                actionSource,
                notificationMessage,
                notificationButtonOptions
            );
        });
    }, 0);
}
