import type ResponseTypeType from 'owa-service/lib/contract/ResponseTypeType';
import loc from 'owa-localize';
import {
    rsvpAcceptNotification,
    rsvpTentativeNotification,
    rsvpTentativePNTNotification,
    rsvpDeclineNotification,
    rsvpDeclinePNTNotification,
} from './getRespondToCalendarEventNotificationMessage.locstring.json';
import { assertNever } from 'owa-assert';

export function getRespondToCalendarEventNotificationMessage(
    responseType: ResponseTypeType,
    isProposeNewTime: boolean
): string {
    let message;

    switch (responseType) {
        case 'Accept':
            message = loc(rsvpAcceptNotification);
            break;
        case 'Tentative':
            message = isProposeNewTime
                ? loc(rsvpTentativePNTNotification)
                : loc(rsvpTentativeNotification);
            break;
        case 'Decline':
            message = isProposeNewTime
                ? loc(rsvpDeclinePNTNotification)
                : loc(rsvpDeclineNotification);
            break;
        default:
            assertNever(responseType as never);
    }

    return message;
}
