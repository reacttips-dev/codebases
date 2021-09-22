import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const onSuggestionsCalloutPositioned = action(
    'ON_SUGGESTIONS_CALLOUT_POSITIONED',
    (scenarioId: SearchScenarioId) => ({
        scenarioId,
    })
);
