import type { FeedbackManagerState } from 'owa-feedback-manager/lib/store/schema/FeedbackManagerState';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import { getReadWriteRecipientViewStateFromEmailAddress } from 'owa-recipient-create-viewstate/lib/util/getReadWriteRecipientViewStateFromEmailAddress';
import createEmptyRecipientWell from './createEmptyRecipientWell';
import { toJS } from 'mobx';
import isValidRecipient from './isValidRecipient';

/**
 * Creates an empty recipient well
 *
 * Prefer `createEmptyRecipientWell` over this if you never need to parse recipients,
 * otherwise you will pull recipient parsing logic into your bundle.
 */
export default function createRecipientWell(
    findPeopleFeedbackManager?: FeedbackManagerState,
    initialEmails?: EmailAddressWrapper[],
    userIdentity?: string,
    initialRecipients?: ReadWriteRecipientViewState[]
): RecipientWellWithFindControlViewState {
    let recipientWell = createEmptyRecipientWell(findPeopleFeedbackManager, userIdentity);

    if (initialRecipients) {
        recipientWell.recipients = toJS(initialRecipients);
    }

    if (initialEmails) {
        for (let email of initialEmails) {
            recipientWell.recipients.push(getReadWriteRecipient(email));
        }
    }

    return recipientWell;
}

function getReadWriteRecipient(email: EmailAddressWrapper) {
    const partialViewState = getReadWriteRecipientViewStateFromEmailAddress(email);
    // the get view state function doesn't check validity, it just set it to true, so check if the recipient is valid here
    return {
        ...partialViewState,
        isValid: isValidRecipient(email),
    };
}
