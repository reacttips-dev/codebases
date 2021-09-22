import rcStore from '../store/store';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import { addSessionMaskedRecipient } from 'owa-substrate-people-suggestions';

export default function deleteFromCache(emailToDelete: EmailAddressWrapper): boolean {
    let i = 0;
    let match = false;
    if (rcStore.recipientCache) {
        while (!match && i < rcStore.recipientCache.length) {
            let email = rcStore.recipientCache[i].EmailAddress;
            if (
                (email.EmailAddress && email.EmailAddress == emailToDelete.EmailAddress) ||
                (email.Name && email.Name == emailToDelete.Name)
            ) {
                match = true;
                rcStore.recipientCache.splice(i, 1);
            } else {
                i++;
            }
        }
    }

    if (emailToDelete.EmailAddress) {
        addSessionMaskedRecipient(emailToDelete.EmailAddress);
    } else if (emailToDelete.Name) {
        addSessionMaskedRecipient(emailToDelete.Name);
    }

    return match;
}
