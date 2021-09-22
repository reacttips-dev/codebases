import { OwaDate, differenceInHours, differenceInCalendarDays, now } from 'owa-datetime';
import { logUsage } from 'owa-analytics';

export default function logDeferredSend(deferredSendTime: OwaDate) {
    logUsage('MailComposeDeferredSend', getCustomData(deferredSendTime));
}

function getCustomData(deferredSendTime: OwaDate) {
    const rightNow = now();
    const deltaHours = differenceInHours(rightNow, deferredSendTime);
    const deltaDays = differenceInCalendarDays(rightNow, deferredSendTime);
    // We log number of days in the future in the reducer.
    // We log number of hours outside the reducer.
    return {
        SendTimeDeltaDays_1: Math.min(deltaDays, 23),
        SendTimeDeltaHours: deltaHours,
    };
}
