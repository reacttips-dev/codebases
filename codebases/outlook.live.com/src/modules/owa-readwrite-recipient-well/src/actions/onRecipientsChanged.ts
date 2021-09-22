import { action } from 'satcheljs';
import type ReadWriteRecipientWellViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientWellViewState';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';

export interface RecipientData {
    isValid: boolean;
    newPersona: FindRecipientPersonaType;
    newEmailAddress?: string;
}

const onRecipientsChanged = action(
    'onRecipientsChanged',
    (
        recipientWellRecipients: ReadWriteRecipientWellViewState,
        recipientData?: RecipientData[]
    ) => ({
        recipientWellRecipients,
        recipientData,
    })
);

export default onRecipientsChanged;
