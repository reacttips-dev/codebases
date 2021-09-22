import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';

export const getRecipientAriaLabel = (recipient: FindRecipientPersonaType) =>
    recipient.EmailAddress.Name && recipient.EmailAddress.EmailAddress
        ? `${recipient.EmailAddress.Name} (${recipient.EmailAddress.EmailAddress})`
        : recipient.EmailAddress.Name || recipient.EmailAddress.EmailAddress || null;
