import {
    infoVotingOrganizerResponseWithTime,
    infoVotingOrganizerResponse,
} from './createVotingInfoBarMessage.locstring.json';
import loc, { format } from 'owa-localize';
import LastAction from 'owa-mail-types/lib/types/LastAction';
import type Message from 'owa-service/lib/contract/Message';
import { formatWeekDayDateTime, userDate } from 'owa-datetime';
import isSharedFolder from 'owa-mail-store/lib/utils/isSharedFolder';
import createVotingInfoBarOptionsAction from './createVotingInfoBarOptionsAction';
import type { InfoBarOptionsAction } from 'owa-info-bar/lib/schema/InfoBarMessageViewState';
import logVoteStatusForMessageMetrics from './logVoteStatusForMessageMetrics';
import type { ClientMessage } from 'owa-mail-store';

export default function createVotingInfoBarMessage(
    message: ClientMessage,
    getLastActionForMessageItem: (message: Message) => string,
    getLastActionTimeForMessageItem: (message: Message) => string
): string | InfoBarOptionsAction {
    const votingInformation = message.VotingInformation;
    const votingOptionsCount = votingInformation.UserOptions.length;
    const responseIndex = Number(getLastActionForMessageItem(message));

    const isLastActionValid: boolean =
        responseIndex <= votingOptionsCount &&
        responseIndex >= LastAction.VotingOptionMin &&
        responseIndex <= LastAction.VotingOptionMax;
    const response: string = isLastActionValid
        ? votingInformation.UserOptions[responseIndex - LastAction.VotingOptionMin].DisplayName
        : null;

    if (response) {
        logVoteStatusForMessageMetrics(true /* hasUserResponded */);
        const lastActionTime: string = getLastActionTimeForMessageItem(message);

        if (lastActionTime) {
            // You responded {decision} on {time}
            const formattedDate = formatWeekDayDateTime(userDate(lastActionTime));
            return format(loc(infoVotingOrganizerResponseWithTime), response, formattedDate);
        }

        // You responded {decision}
        return format(loc(infoVotingOrganizerResponse), response);
    } else if (
        !isSharedFolder(message.ParentFolderId.Id) &&
        message.MailboxInfo.type === 'UserMailbox'
    ) {
        // The sender has requested a vote. To respond
        return createVotingInfoBarOptionsAction(votingInformation);
    }

    return null;
}
