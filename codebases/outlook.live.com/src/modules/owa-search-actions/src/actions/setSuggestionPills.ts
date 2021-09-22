import { action } from 'satcheljs';
import type { ObservableMap } from 'mobx';
import type { PillSuggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';
import type { SearchScenarioId } from 'owa-search-store';

export const setSuggestionPills = action(
    'SET_SUGGESTION_PILLS',
    (suggestionPills: ObservableMap<string, PillSuggestion>, scenarioId: SearchScenarioId) => ({
        suggestionPills,
        scenarioId,
    })
);
