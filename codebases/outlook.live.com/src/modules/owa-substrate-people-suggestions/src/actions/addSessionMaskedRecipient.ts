import store from '../store/store';
import { action } from 'satcheljs/lib/legacy';

export default action('addSessionMaskedRecipient')(function addSessionMaskedRecipient(
    maskedEmailAddressOrName: string
) {
    store.sessionMaskedRecipients[maskedEmailAddressOrName] = true;
});
