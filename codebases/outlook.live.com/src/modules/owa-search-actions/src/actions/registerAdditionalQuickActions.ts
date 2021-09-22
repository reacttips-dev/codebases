import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';
import type { Suggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';

/**
 * Action for the consuming client to register additional quick actions for suggestions
 */
export const registerAdditionalQuickActions = action(
    'REGISTER_ADDITIONAL_QUICK_ACTIONS',
    (scenarioId: SearchScenarioId, callback: (suggestion: Suggestion) => JSX.Element[]) => ({
        scenarioId,
        callback,
    })
);
