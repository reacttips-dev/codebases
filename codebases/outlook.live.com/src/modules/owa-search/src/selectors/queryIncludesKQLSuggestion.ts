import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import { PillSuggestion, SuggestionKind } from 'owa-search-service/lib/data/schema/SuggestionSet';

export default function queryIncludesKQLSuggestion(scenarioId: SearchScenarioId): boolean {
    const store = getScenarioStore(scenarioId);
    const suggestionPills = store.suggestionPills;

    // If there aren't any pills in the store, return false.
    if (!suggestionPills || suggestionPills.size === 0) {
        return false;
    }

    // If there are any persona pills in the store, return true.
    const personaPills = [...suggestionPills.values()].filter(
        (pill: PillSuggestion) => pill.kind === SuggestionKind.People
    );
    if (personaPills.length > 0) {
        return true;
    }

    // If no conditions have been hit, then query doesn't include KQL.
    return false;
}
