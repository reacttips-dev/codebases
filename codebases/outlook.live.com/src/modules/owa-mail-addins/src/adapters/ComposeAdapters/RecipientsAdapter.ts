import { RecipientFieldEnum } from 'owa-addins-core';
import type { ComposeViewState } from 'owa-mail-compose-store';
import showBccWell from 'owa-mail-compose-actions/lib/actions/showBccWell';
import showCcWell from 'owa-mail-compose-actions/lib/actions/showCcWell';
import switchToReadWriteRecipient from 'owa-mail-compose-actions/lib/actions/switchToReadWriteRecipient';
import getRecipientsFromWellViewState from 'owa-mail-compose-actions/lib/utils/getRecipientsFromWellViewState';
import addRecipientsToRecipientWell from 'owa-recipient-common/lib/actions/addRecipientsToRecipientWell';
import clearRecipientWell from 'owa-readwrite-recipient-well/lib/actions/clearRecipientWell';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import { getReadWriteRecipientViewStateFromEmailAddress } from 'owa-recipient-create-viewstate/lib/util/getReadWriteRecipientViewStateFromEmailAddress';

export const getRecipients = (viewState: ComposeViewState) => (
    type: RecipientFieldEnum
): EmailAddressWrapper[] => {
    const recipientWell = getRecipientWellByType(viewState, type);
    return getRecipientsFromWellViewState(recipientWell);
};

export const setRecipients = (viewState: ComposeViewState) => (
    type: RecipientFieldEnum,
    newRecipients: EmailAddressWrapper[]
): void => {
    showReadWriteRecipientWell(viewState, type);
    const recipientWell: RecipientWellWithFindControlViewState = getRecipientWellByType(
        viewState,
        type
    );
    clearRecipientWell(recipientWell);
    const newRecipientViewStates = newRecipients.map(
        getReadWriteRecipientViewStateFromEmailAddress
    );
    addRecipientsToRecipientWell(newRecipientViewStates, recipientWell);
};

export const addRecipients = (viewState: ComposeViewState) => (
    type: RecipientFieldEnum,
    newRecipients: EmailAddressWrapper[]
): void => {
    showReadWriteRecipientWell(viewState, type);
    const recipientWell: RecipientWellWithFindControlViewState = getRecipientWellByType(
        viewState,
        type
    );
    const newRecipientViewStates = newRecipients.map(
        getReadWriteRecipientViewStateFromEmailAddress
    );
    addRecipientsToRecipientWell(newRecipientViewStates, recipientWell);
};

function showReadWriteRecipientWell(viewState: ComposeViewState, type: RecipientFieldEnum) {
    if (viewState.showCompactRecipientWell) {
        switchToReadWriteRecipient(viewState);
    }

    switch (type) {
        case RecipientFieldEnum.To:
            return;
        case RecipientFieldEnum.Cc:
            showCcWell(viewState);
            return;
        case RecipientFieldEnum.Bcc:
            showBccWell(viewState);
            return;
    }
}

const getRecipientWellByType = (
    viewState: ComposeViewState,
    type: RecipientFieldEnum
): RecipientWellWithFindControlViewState => {
    let recipientWell;
    switch (type) {
        case RecipientFieldEnum.To:
            recipientWell = viewState.toRecipientWell;
            break;
        case RecipientFieldEnum.Cc:
            recipientWell = viewState.ccRecipientWell;
            break;
        case RecipientFieldEnum.Bcc:
            recipientWell = viewState.bccRecipientWell;
            break;
    }
    return recipientWell;
};
