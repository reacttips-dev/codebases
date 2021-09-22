import type { ComposeViewState } from 'owa-mail-compose-store';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import getRecipientsFromRecipientWells from 'owa-recipient-common/lib/utils/getRecipientsFromRecipientWells';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';

export const getRecipientWellsFromComposeViewState = (
    composeViewState: ComposeViewState
): RecipientWellWithFindControlViewState[] => [
    composeViewState.toRecipientWell,
    composeViewState.ccRecipientWell,
    composeViewState.bccRecipientWell,
];

export const getAllRecipientsAsEmailAddressStrings = (
    composeViewState: ComposeViewState
): string[] => {
    const recipeintWells: RecipientWellWithFindControlViewState[] = getRecipientWellsFromComposeViewState(
        composeViewState
    );
    return getRecipientsFromRecipientWells(recipeintWells).map(
        recipient => recipient.persona.EmailAddress.EmailAddress
    );
};

/**
 * Extracts `EmailAddressWrapper`s for recipients from all recipient wells in a given composeViewState
 * @param composeViewState
 * @returns EmailAddressWrapper[]
 */
export const getAllRecipients = (composeViewState: ComposeViewState): EmailAddressWrapper[] => {
    const recipeintWells: RecipientWellWithFindControlViewState[] = getRecipientWellsFromComposeViewState(
        composeViewState
    );
    return getRecipientsFromRecipientWells(recipeintWells).map(
        recipient => recipient.persona.EmailAddress
    );
};
