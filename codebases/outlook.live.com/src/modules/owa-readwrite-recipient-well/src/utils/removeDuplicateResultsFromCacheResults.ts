import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import type PersonaType from 'owa-service/lib/contract/PersonaType';

export default function removeDuplicateResultsFromCacheResults(
    currentEmailAddresses: Map<string, FindRecipientPersonaType>,
    cacheResults: PersonaType[]
): PersonaType[] {
    let filteredSuggestions = cacheResults.filter(value => {
        return (
            currentEmailAddresses[value.EmailAddress ? value.EmailAddress.EmailAddress : ''] == null
        );
    });
    return filteredSuggestions;
}
