import { action } from 'satcheljs';
import { actionWithDatapoint } from 'owa-analytics-actions';

export const neverShowDialogAgain = action('neverShowDialogAgain');

export const newRoamingTimeZone = action('newRoamingTimeZone', (timeZone: string) => ({
    timeZone,
}));

export const setRoamingTimeZoneNotificationIsDisabled = actionWithDatapoint(
    'toggleRoamingTimeZoneNotificationIsDisabled',
    (isDisabled: boolean) => ({
        isDisabled,
    }),
    actionMessage => ({
        customData: { isDisabled_1: actionMessage.isDisabled },
    })
);
