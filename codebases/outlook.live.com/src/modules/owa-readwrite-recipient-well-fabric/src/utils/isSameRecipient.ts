import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';

const isSameRecipient = (a: ReadWriteRecipientViewState, b: ReadWriteRecipientViewState): boolean =>
    // if they have matching non-null IDs
    (a.persona.id === b.persona.id && a.persona.id != null) ||
    // else, if they have matching non-null email strings
    (a.persona.EmailAddress != null &&
        a.persona.EmailAddress.EmailAddress != null &&
        a.persona.EmailAddress.EmailAddress === b.persona.EmailAddress.EmailAddress);

export default isSameRecipient;
