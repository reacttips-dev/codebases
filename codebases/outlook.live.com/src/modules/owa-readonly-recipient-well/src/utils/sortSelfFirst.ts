import type ReadOnlyRecipientViewState from 'owa-recipient-types/lib/types/ReadOnlyRecipientViewState';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default function sortSelfFirst(
    recipients: ReadOnlyRecipientViewState[]
): ReadOnlyRecipientViewState[] {
    const recipientsClone = recipients.slice(0); // Clone to prevent modifying state
    for (let i = 0; i < recipientsClone.length; i++) {
        if (
            recipientsClone[i].email.EmailAddress ==
            getUserConfiguration().SessionSettings.UserEmailAddress
        ) {
            recipientsClone.splice(0, 0, recipientsClone.splice(i, 1)[0]);
            return recipientsClone;
        }
    }
    return recipientsClone;
}
