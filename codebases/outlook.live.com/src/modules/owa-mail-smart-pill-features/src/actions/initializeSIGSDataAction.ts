import { action } from 'satcheljs';

export default action(
    'initializeSIGSDataAction',
    (
        itemId: string,
        isSmartSuggestionsRendered: string,
        suggestionTypesRendered: string,
        suggestionsRendered: string,
        extractionId: string
    ) => {
        return {
            itemId: itemId,
            isSmartSuggestionsRendered: isSmartSuggestionsRendered,
            suggestionTypesRendered: suggestionTypesRendered,
            suggestionsRendered: suggestionsRendered,
            extractionId: extractionId,
        };
    }
);
