import type PersonaType from 'owa-service/lib/contract/PersonaType';

export default function getKeyForSuggestion(person: PersonaType): string {
    if (!person) {
        return null;
    }

    return person.EmailAddress?.EmailAddress || person.PersonaId?.Id;
}
