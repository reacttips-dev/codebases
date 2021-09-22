import { action } from 'satcheljs';

export const enum CalloutResult {
    Enabled,
    Disabled,
    Dismissed,
}

export const showEnableWebPushCallout = action('showEnableWebPushCallout');
export const completeEnableWebPushCallout = action(
    'completeEnableWebPushCallout',
    (result: CalloutResult) => ({
        result,
    })
);
