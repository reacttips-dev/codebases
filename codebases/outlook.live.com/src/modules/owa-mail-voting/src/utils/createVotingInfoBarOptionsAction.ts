import {
    infoVotingRequestVote,
    infoVotingActionLink,
    infoOptionsVotingConfirmationDialogLabel,
} from './createVotingInfoBarOptionsAction.locstring.json';
import loc from 'owa-localize';
import type {
    InfoBarOptionsAction,
    InfoBarOption,
} from 'owa-info-bar/lib/schema/InfoBarMessageViewState';
import getVotingOptions from '../selectors/getVotingOptions';
import type VotingOption from '../store/schema/VotingOption';
import type VotingInformationType from 'owa-service/lib/contract/VotingInformationType';
import { defaultProviderName } from '../store/schema/MailVotingTypes';
import { lazyCastVoteForProvider } from '../index';

import logVoteStatusForMessageMetrics from './logVoteStatusForMessageMetrics';

export default function createVotingInfoBarOptionsAction(
    messageVotingInformation?: VotingInformationType
): InfoBarOptionsAction {
    const cachedOptions = getVotingOptions();
    let votingOptions: VotingOption[] = cachedOptions;

    // The cache hasn't been updated, so use the options on the message
    // for now until the response is returned from the voting load request
    // and the voting store is updated
    if (
        cachedOptions.length == 0 &&
        messageVotingInformation &&
        messageVotingInformation.UserOptions.length > 0
    ) {
        votingOptions = messageVotingInformation.UserOptions.map(userOption => {
            return {
                provider: defaultProviderName,
                displayName: userOption.DisplayName,
            } as VotingOption;
        });
    } else {
        // We log the status only when the options are cached, so we dont log an extra
        // metric logged when the request is done loading
        logVoteStatusForMessageMetrics(false /* hasUserResponded */);
    }

    // Convert the votingOptions to the infoBarOption type
    const infoBarOptions: InfoBarOption[] = votingOptions.map(option => {
        return {
            displayName: option.displayName,
            value: option,
        } as InfoBarOption;
    });

    return {
        preActionText: loc(infoVotingRequestVote),
        actionLinkText: loc(infoVotingActionLink),
        options: infoBarOptions,
        onSelect: infoBarOption => lazyCastVoteForProvider.importAndExecute(infoBarOption),
        hasSelectionConfirmationDialog: true,
        selectionConfirmDialogFormatString: loc(infoOptionsVotingConfirmationDialogLabel),
    };
}
