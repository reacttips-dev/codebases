import type { CalendarEventEntity } from 'owa-calendar-events-store';
import type { ViewType } from 'owa-calendar-actions';
import { ControlIcons } from 'owa-control-icons';
import loc from 'owa-localize';
import { undo_0 } from 'owa-locstrings/lib/strings/undo_0.locstring.json';
import {
    calendarNotificationsBarDeleteEvent,
    calendarNotificationsBarCancelMeeting,
    calendarNotificationsBarDeclineMeeting,
} from './showUndoNotificationForInstantDelete.locstring.json';
import {
    DefaultHotKeyCommand,
    lazyShowCalendarNotification,
    NotificationBarCallbackReason,
} from 'owa-calendar-notification-bar';
import { isDeepLink } from 'owa-url';
import { getOwaWorkload, OwaWorkload } from 'owa-workloads';

/**
 * Shows a notification telling the user they can undo the action
 * @returns a promise that resolves true if the user wants to undo, false if the notification is dismissed for any other reason
 */
export function showUndoNotificationForInstantDelete(
    eventToDelete: CalendarEventEntity,
    responseSent: boolean,
    actionSource: ViewType
): Promise<boolean> {
    const currentModuleSupportsUndo = !isDeepLink() && getOwaWorkload() == OwaWorkload.Calendar;
    if (currentModuleSupportsUndo) {
        let notificationMessage = loc(calendarNotificationsBarDeleteEvent);
        if (eventToDelete.IsMeeting && responseSent && !eventToDelete.IsCancelled) {
            notificationMessage = eventToDelete.IsOrganizer
                ? loc(calendarNotificationsBarCancelMeeting)
                : loc(calendarNotificationsBarDeclineMeeting);
        }

        return new Promise<boolean>((resolve, reject) => {
            lazyShowCalendarNotification.import().then(showCalendarNotification => {
                showCalendarNotification(
                    'instantCalendarEventDelete',
                    actionSource,
                    notificationMessage,
                    {
                        icon: ControlIcons.Error,
                        primaryActionHotKeyCommand: DefaultHotKeyCommand.Undo,
                    },

                    {
                        primaryActionText: loc(undo_0),
                        notificationCallback: reason => {
                            if (reason === NotificationBarCallbackReason.PrimaryActionClicked) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        },
                    }
                );
            });
        });
    }
    return Promise.resolve(false);
}
