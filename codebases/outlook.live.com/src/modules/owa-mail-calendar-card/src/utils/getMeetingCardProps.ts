import type { ClientItem } from 'owa-mail-store';
import type MeetingCancellationMessageType from 'owa-service/lib/contract/MeetingCancellationMessageType';
import type MeetingMessage from 'owa-service/lib/contract/MeetingMessage';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';
import type MeetingResponseMessageType from 'owa-service/lib/contract/MeetingResponseMessageType';
import {
    isMeetingCancellation,
    isMeetingRequest,
    isMeetingMessageForSeriesException,
    isMeetingMessageForSingleEvent,
    isMeetingMessageForSeriesMaster,
    isMeetingResponse,
} from 'owa-meeting-message';

/**
 * Gets the MeetingMessage that will be used to populate the Calendar Card.
 * This message should be representative of all Meeting Messages of the conversation
 * @param items All the items in a Conversation thread
 * @returns A single Meeting Message that represents the last update to a meeting conversation
 *          Or null if none can be found and no card should be shown.
 */
export default function getMeetingCardProps(
    items: ClientItem[]
): {
    latestMeetingMessage: MeetingMessage;
    latestRequestId: string;
    latestCancellationId: string;
} {
    const meetingMessages = items.filter(isValidMeetingMessageForCard);
    const singles = meetingMessages.filter(isMeetingMessageForSingleEvent);
    let occurrences = meetingMessages.filter(isMeetingMessageForSeriesException);
    let recurringMasters = meetingMessages.filter(isMeetingMessageForSeriesMaster);

    let latestMeetingMessage: MeetingMessage = null;
    let latestRequestId: string = null;
    let latestCancellationId: string = null;

    if (singles.length > 0) {
        // If there is at least one single event. All other events must be singles
        // and share the same ItemId. Return the last received one.
        if (
            recurringMasters.length == 0 &&
            occurrences.length == 0 &&
            allItemsHaveTheSameItemId(singles)
        ) {
            latestMeetingMessage = singles[singles.length - 1];
            latestRequestId = getLatestMeetingRequestId(singles);
            latestCancellationId = getLatestMeetingCancellationId(singles);
        }
    } else if (recurringMasters.length > 0) {
        // If there is at least one Recurring Master, all the others must be recurring masters
        // and share the same ItemId. Return the last received one.
        if (occurrences.length == 0 && allItemsHaveTheSameItemId(recurringMasters)) {
            latestMeetingMessage = recurringMasters[recurringMasters.length - 1];
            latestRequestId = getLatestMeetingRequestId(recurringMasters);
            latestCancellationId = getLatestMeetingCancellationId(recurringMasters);
        }
    } else if (occurrences.length > 0) {
        // If there are only occurrences, all messages must share the same ItemId
        // Return the last received one.
        if (allItemsHaveTheSameItemId(occurrences)) {
            latestMeetingMessage = occurrences[occurrences.length - 1];
            latestRequestId = getLatestMeetingRequestId(occurrences);
            latestCancellationId = getLatestMeetingCancellationId(occurrences);
        }
    }

    return {
        latestMeetingMessage: latestMeetingMessage,
        latestRequestId: latestRequestId,
        latestCancellationId: latestCancellationId,
    };
}

function getLatestMeetingRequestId(items: MeetingMessage[]): string | null {
    const requests = items.filter(item => isMeetingRequest(item.ItemClass));
    const latestRequest = requests.length > 0 ? requests[requests.length - 1] : null;
    return latestRequest ? latestRequest.ItemId.Id : null;
}

function getLatestMeetingCancellationId(items: MeetingMessage[]): string | null {
    const cancellations = items.filter(item => isMeetingCancellation(item.ItemClass));
    const lastCancellation =
        cancellations.length > 0 ? cancellations[cancellations.length - 1] : null;
    return lastCancellation ? lastCancellation.ItemId.Id : null;
}

function isValidMeetingMessageForCard(item: ClientItem): boolean {
    if (item.MailboxInfo && item.MailboxInfo.type === 'GroupMailbox') {
        // TODO VSO:54447 - Add group calendar support for the card
        return false;
    }

    if (
        !isMeetingRequest(item.ItemClass) &&
        !isMeetingCancellation(item.ItemClass) &&
        !isMeetingResponse(item.ItemClass)
    ) {
        return false;
    }

    const meetingItem = item as
        | MeetingRequestMessageType
        | MeetingCancellationMessageType
        | MeetingResponseMessageType;

    if (!!meetingItem.IsDelegated && !!meetingItem.ReceivedRepresenting) {
        // TODO VSO:55115 - Add delegate support for the card
        return false;
    }

    if (!meetingItem.AssociatedCalendarItemId) {
        return false;
    }

    return true;
}

function allItemsHaveTheSameItemId(items: MeetingMessage[]): boolean {
    return items.every(
        item => item.AssociatedCalendarItemId.Id == items[0].AssociatedCalendarItemId.Id
    );
}
