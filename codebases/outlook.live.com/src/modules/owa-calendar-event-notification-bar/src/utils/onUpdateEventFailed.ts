import { tryAgainLabel } from 'owa-locstrings/lib/strings/tryagainlabel.locstring.json';
import loc from 'owa-localize';
import {
    DefaultHotKeyCommand,
    lazyShowCalendarNotificationWithButtonCallback,
} from 'owa-calendar-notification-bar';
import { ControlIcons } from 'owa-control-icons';
import type { ViewType } from 'owa-calendar-actions';
import { parseErrorString } from './parseErrorString';
import { calendarNotificationsBarUpdateEventFailed } from 'owa-locstrings/lib/strings/calendarnotificationsbarupdateeventfailed.locstring.json';

export function onUpdateEventFailed(
    errorMessage: any,
    retryFunction: () => void | null,
    actionSource: ViewType
) {
    if (retryFunction) {
        lazyShowCalendarNotificationWithButtonCallback
            .import()
            .then(showCalendarNotificationWithButtonCallback => {
                showCalendarNotificationWithButtonCallback(
                    'updateCalendarEventFailed',
                    actionSource,
                    getErrorString(errorMessage),
                    loc(tryAgainLabel),
                    () => retryFunction(),
                    ControlIcons.Error,
                    DefaultHotKeyCommand.Retry
                );
            });
    }
}

function getErrorString(errorMessage: any): string {
    const errorString = parseErrorString(errorMessage);
    return errorString ? errorString : loc(calendarNotificationsBarUpdateEventFailed);
}
