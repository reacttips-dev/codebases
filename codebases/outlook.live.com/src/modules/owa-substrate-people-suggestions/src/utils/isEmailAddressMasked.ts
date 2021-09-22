import { getStore } from '../store/store';

export default function isEmailAddressMasked(emailAddress: string | null | undefined): boolean {
    // null and undefined are never in the session masked recipients, so this membership check
    // will always be falsy
    return !!getStore().sessionMaskedRecipients[emailAddress];
}
