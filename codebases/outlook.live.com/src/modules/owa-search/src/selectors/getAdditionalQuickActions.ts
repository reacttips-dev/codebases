import type { SearchScenarioId } from 'owa-search-store';
import type { Suggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';

let internalAdditionalQuickActionsFunction: {
    [key: string]: (suggestion: Suggestion) => JSX.Element[];
} = {};

export default function getAdditionalQuickActions(scenarioId: SearchScenarioId) {
    return internalAdditionalQuickActionsFunction[scenarioId];
}

export function registerAdditionalQuickActionsInternal(
    scenarioId: SearchScenarioId,
    additionalQuickActionsFunction: (suggestion: Suggestion) => JSX.Element[]
) {
    internalAdditionalQuickActionsFunction[scenarioId] = additionalQuickActionsFunction;
}
