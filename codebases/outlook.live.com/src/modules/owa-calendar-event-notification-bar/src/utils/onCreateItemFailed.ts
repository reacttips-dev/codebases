import { ControlIcons } from 'owa-control-icons';
import loc from 'owa-localize';
import { tryAgainLabel } from 'owa-locstrings/lib/strings/tryagainlabel.locstring.json';
import {
    DefaultHotKeyCommand,
    lazyShowCalendarNotificationWithButtonCallback,
} from 'owa-calendar-notification-bar';
import type { ViewType } from 'owa-calendar-actions';
import { parseErrorString } from './parseErrorString';
import { calendarNotificationsBarCreateEventFailed } from 'owa-locstrings/lib/strings/calendarnotificationsbarcreateeventfailed.locstring.json';

export function onCreateItemFailed(
    errorMessage: any,
    retryFunction: (() => void) | null,
    actionSource: ViewType
) {
    lazyShowCalendarNotificationWithButtonCallback
        .import()
        .then(showNotificationWithButtonCallback => {
            showNotificationWithButtonCallback(
                'instantCalendarEventCreateFailed',
                actionSource,
                getErrorString(errorMessage),
                loc(tryAgainLabel),
                () => retryFunction?.(),
                ControlIcons.Error,
                DefaultHotKeyCommand.Retry
            );
        });
}

function getErrorString(errorMessage: any): string {
    const errorString = parseErrorString(errorMessage);
    return errorString ? errorString : loc(calendarNotificationsBarCreateEventFailed);
}
