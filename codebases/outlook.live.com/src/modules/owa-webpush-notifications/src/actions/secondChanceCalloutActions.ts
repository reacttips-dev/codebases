import { action } from 'satcheljs';

export const showWebPushSecondChanceCallout = action('showWebPushSecondChanceCallout');
export const completeWebPushSecondChanceCallout = action(
    'completeWebPushSecondChanceCallout',
    (tryAgain: boolean) => ({ tryAgain })
);
