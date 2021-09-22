import { action } from 'satcheljs';
import type SmimeViewState from 'owa-smime-types/lib/schema/SmimeViewState';

// Action called to set the current BCC recipient of the mail.
export default action(
    'setCurrentBccRecipient',
    (smimeViewState: SmimeViewState, currentBccRecipient: number) => ({
        smimeViewState,
        currentBccRecipient,
    })
);
