import type { PeopleSuggestion } from 'owa-search-service';

export default function isFromPersona(persona: PeopleSuggestion): boolean {
    return (
        persona.QueryText?.lastIndexOf('(from:', 0) === 0 ||
        persona.EmailAddressDisplayText?.lastIndexOf('from:', 0) === 0 ||
        !!persona.CustomQueryText?.FromKql
    );
}
