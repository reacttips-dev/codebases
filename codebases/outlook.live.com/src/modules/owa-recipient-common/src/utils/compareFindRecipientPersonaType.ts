import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';

export default function compareFindRecipientPersonaType(
    personaA: FindRecipientPersonaType,
    personaB: FindRecipientPersonaType
): boolean {
    return (
        personaA != null &&
        personaB != null &&
        (personaA == personaB ||
            (personaA.EmailAddress &&
                personaB.EmailAddress &&
                personaA.EmailAddress.EmailAddress != null &&
                personaB.EmailAddress.EmailAddress != null &&
                personaA.EmailAddress.EmailAddress.toLowerCase() ==
                    personaB.EmailAddress.EmailAddress.toLowerCase()) ||
            (personaA.ADObjectId &&
                personaB.ADObjectId &&
                personaA.ADObjectId == personaB.ADObjectId) ||
            (personaA.PersonaId && personaB.PersonaId && personaA.PersonaId == personaB.PersonaId))
    );
}
