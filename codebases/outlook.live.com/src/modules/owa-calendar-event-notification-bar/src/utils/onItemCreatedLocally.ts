import { ControlIcons } from 'owa-control-icons';
import loc from 'owa-localize';
import { lazyShowCalendarNotification } from 'owa-calendar-notification-bar';
import type { ViewType } from 'owa-calendar-actions';
import { calendarNotificationsBarCreateEvent } from 'owa-locstrings/lib/strings/calendarNotificationsBarCreateEvent.locstring.json';

export function onItemCreatedLocally(actionSource: ViewType) {
    lazyShowCalendarNotification.import().then(showCalendarNotification => {
        showCalendarNotification(
            'instantCalendarEventCreate',
            actionSource,
            loc(calendarNotificationsBarCreateEvent),
            { icon: ControlIcons.CheckMark }
        );
    });
}
