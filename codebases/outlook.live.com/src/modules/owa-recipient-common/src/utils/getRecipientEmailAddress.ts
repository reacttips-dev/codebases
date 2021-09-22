import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';

/**
 * Returns recipient email address from ReadWriteRecipientViewState object
 * @param {ReadWriteRecipientViewState} recipient object containing email address
 * @returns string containing recipient email address
 */
export default function getRecipientEmailAddress(recipient: ReadWriteRecipientViewState): string {
    if (recipient?.persona?.EmailAddress) {
        return recipient.persona.EmailAddress.EmailAddress;
    }
    return null;
}
