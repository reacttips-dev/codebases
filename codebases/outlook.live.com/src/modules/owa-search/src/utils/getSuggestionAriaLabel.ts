import {
    SuggestionKind,
    Suggestion,
    KeywordSuggestion,
} from 'owa-search-service/lib/data/schema/SuggestionSet';
import {
    historySuggestionLabel,
    textSuggestionLabel,
    peopleSuggestionLabel,
    fileSuggestionLabel,
    categorySuggestionLabel,
    messageSuggestionLabel,
    eventSuggestionLabel,
    suggestionAriaLabel,
} from '../components/suggestions/SuggestionAriaLabels.locstring.json';
import loc, { format } from 'owa-localize';

export default function getSuggestionAriaLabel(suggestion: Suggestion, ariaLabel: string): string {
    const kindLabel: string = getKindLabel(suggestion);

    if (kindLabel) {
        return format(loc(suggestionAriaLabel), kindLabel, ariaLabel);
    }

    return null;
}

function getKindLabel(suggestion: Suggestion): string {
    switch (suggestion.kind) {
        case SuggestionKind.Keywords: {
            return (suggestion as KeywordSuggestion).Attributes?.IsHistory
                ? loc(historySuggestionLabel)
                : loc(textSuggestionLabel);
        }
        case SuggestionKind.People: {
            return loc(peopleSuggestionLabel);
        }
        case SuggestionKind.File: {
            return loc(fileSuggestionLabel);
        }
        case SuggestionKind.Category: {
            return loc(categorySuggestionLabel);
        }
        case SuggestionKind.Message: {
            return loc(messageSuggestionLabel);
        }
        case SuggestionKind.Event: {
            return loc(eventSuggestionLabel);
        }
        default:
            return null;
    }
}
