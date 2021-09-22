import type { ViewType } from 'owa-calendar-actions';
import {
    DefaultHotKeyCommand,
    lazyShowCalendarNotificationWithButtonCallback,
} from 'owa-calendar-notification-bar';
import { ControlIcons } from 'owa-control-icons';
import loc from 'owa-localize';
import { tryAgainLabel } from 'owa-locstrings/lib/strings/tryagainlabel.locstring.json';
import { calendarNotificationsBarDeleteEventFailed } from 'owa-locstrings/lib/strings/calendarnotificationsbardeleteeventfailed.locstring.json';
import { parseErrorString } from './parseErrorString';

export function onDeleteEventFailed(
    errorMessage: any,
    retryFunction: () => void | null,
    actionSource: ViewType
) {
    if (retryFunction) {
        lazyShowCalendarNotificationWithButtonCallback
            .import()
            .then(showCalendarNotificationWithButtonCallback => {
                showCalendarNotificationWithButtonCallback(
                    'instantCalendarEventDeleteFailed',
                    actionSource,
                    getErrorString(errorMessage),
                    loc(tryAgainLabel),
                    () => retryFunction(),
                    ControlIcons.Delete,
                    DefaultHotKeyCommand.Retry
                );
            });
    }
}

function getErrorString(errorMessage: any): string {
    const errorString = parseErrorString(errorMessage);
    return errorString ? errorString : loc(calendarNotificationsBarDeleteEventFailed);
}
