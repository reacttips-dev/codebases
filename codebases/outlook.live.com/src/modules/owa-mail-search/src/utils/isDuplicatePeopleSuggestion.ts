import type { ReadWriteRecipientViewState } from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';

/**
 * Determines if suggestion already exists within suggestions.
 */
export default function isDuplicatePeopleSuggestion(
    suggestions: ReadWriteRecipientViewState[],
    suggestion: ReadWriteRecipientViewState
): boolean {
    return (
        suggestions.filter((existingSuggestion: ReadWriteRecipientViewState) => {
            return (
                existingSuggestion.persona.EmailAddress.EmailAddress ===
                suggestion.persona.EmailAddress.EmailAddress
            );
        }).length > 0
    );
}
