import type { PeopleSuggestion } from 'owa-search-service';

export default function isToPersona(persona: PeopleSuggestion): boolean {
    return (
        persona.QueryText?.lastIndexOf('(to:', 0) === 0 ||
        persona.EmailAddressDisplayText?.lastIndexOf('to:', 0) === 0 ||
        !!persona.CustomQueryText?.ToKql
    );
}
