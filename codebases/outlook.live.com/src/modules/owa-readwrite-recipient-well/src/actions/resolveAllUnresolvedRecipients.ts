import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import resolveQueryStringToRecipient from './resolveQueryStringToRecipient';
import setForceResolveState from './setForceResolveState';
import updateIsEditing from './updateIsEditing';
import { action } from 'satcheljs/lib/legacy';
import { logUsage } from 'owa-analytics';

export default action('resolveAllUnresolvedRecipients')(
    async function resolveAllUnresolvedRecipients(
        recipientWell: RecipientWellWithFindControlViewState | FindControlViewState,
        recipients: ReadWriteRecipientViewState[],
        onBeforeWaitingResolve?: () => void
    ): Promise<void> {
        setForceResolveState(recipientWell, true);
        // Trim the query string prior to resolving in case of just empty spaces in the send scenario.
        recipientWell.queryString = recipientWell.queryString.trim();
        if (
            (recipientWell as RecipientWellWithFindControlViewState).recipients &&
            recipientWell.queryString
        ) {
            onBeforeWaitingResolve?.();
            await resolveQueryStringToRecipient(
                recipientWell as RecipientWellWithFindControlViewState,
                false /* shouldDirectlyResolve */,
                true /* searchDirectory */,
                true /* resolveIfSingle */
            );
        } else {
            let indexToRemove = -1;
            for (var i = 0; i < recipients.length; i++) {
                if (
                    recipients[i].persona?.EmailAddress &&
                    !recipients[i].persona.EmailAddress.EmailAddress
                ) {
                    let persona = recipients[i].persona;

                    // Don't log the known single type of mailbox that doesn't have an email address
                    if (persona.EmailAddress.MailboxType != 'PrivateDL') {
                        // There are server errors that report of empty email addresses.
                        // However, we're not sure how users are adding things to the well without email addresses.
                        // This should help us identify what the mailbox type and routing type are for those specific entries
                        // We can then understand what we're handling incorrectly client side for those recipient types
                        logUsage('EmptyEmailAddress', [
                            persona.EmailAddress.MailboxType,
                            persona.EmailAddress.RoutingType,
                        ]);
                    }
                }
                if (!recipients[i].isValid) {
                    indexToRemove = i;
                    break;
                }
            }

            if (indexToRemove != -1) {
                updateIsEditing(recipients[indexToRemove], true /*isEditing*/);
            } else {
                // This is the base case for the recursion
                setForceResolveState(recipientWell, false);
            }
        }
    }
);
