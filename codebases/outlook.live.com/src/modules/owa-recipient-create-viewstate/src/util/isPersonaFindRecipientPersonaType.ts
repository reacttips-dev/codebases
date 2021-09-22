import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import { trace } from 'owa-trace';

export const isPersonaFindRecipientPersonaType = (
    persona: PersonaType
): persona is FindRecipientPersonaType => {
    const isFindRecipientPersonaType = persona.EmailAddress !== undefined;
    if (!isFindRecipientPersonaType) {
        trace.warn('Recipient cache contained a persona that had no EmailAddress');
    }
    return isFindRecipientPersonaType;
};
