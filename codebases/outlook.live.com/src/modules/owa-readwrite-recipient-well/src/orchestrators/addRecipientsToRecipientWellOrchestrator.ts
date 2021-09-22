import { orchestrator } from 'satcheljs';
import addRecipientsToRecipientWell from 'owa-recipient-common/lib/actions/addRecipientsToRecipientWell';
import addToCache from 'owa-recipient-cache/lib/actions/addToCache';
import onRecipientsChanged, { RecipientData } from '../actions/onRecipientsChanged';
import resolveAllUnresolvedRecipients from '../actions/resolveAllUnresolvedRecipients';
import isRecipientWellWithFindControlViewState from '../utils/isRecipientWellWithFindControlViewState';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * Add new recipients to the cache.
 */
orchestrator(addRecipientsToRecipientWell, actionMessage => {
    const { newRecipients } = actionMessage;

    newRecipients.forEach(newRecipient => {
        if (newRecipient.isValid) {
            addToCache([newRecipient.persona]);
        }
    });
});

/**
 * When a ReadWriteRecipientWellWithFindControlViewState had recipients added to it,
 * if it is in `inForceResolve`, then trigger the `resolveAllUnresolvedRecipients` action.
 */
orchestrator(addRecipientsToRecipientWell, actionMessage => {
    const { recipientWell } = actionMessage;

    // If we're in force resolve state, continue resolving unresolved recipients.
    if (
        recipientWell &&
        isRecipientWellWithFindControlViewState(recipientWell) &&
        recipientWell.inForceResolve &&
        !isFeatureEnabled('mon-rp-unifiedPicker')
    ) {
        resolveAllUnresolvedRecipients(recipientWell, recipientWell.recipients);
    }
});

/**
 * Trigger other package's listeners on the message.
 */
orchestrator(addRecipientsToRecipientWell, actionMessage => {
    const { recipientWell, newRecipients } = actionMessage;
    onRecipientsChanged(
        recipientWell,
        newRecipients.map(
            (recipient): RecipientData => ({
                isValid: recipient.isValid,
                newPersona: recipient.persona,
                newEmailAddress: recipient.persona.EmailAddress.EmailAddress,
            })
        )
    );
});
