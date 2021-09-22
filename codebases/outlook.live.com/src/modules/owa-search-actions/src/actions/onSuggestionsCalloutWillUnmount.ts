import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const onSuggestionsCalloutWillUnmount = action(
    'ON_SUGGESTIONS_CALLOUT_WILL_UNMOUNT',
    (scenarioId: SearchScenarioId) => ({
        scenarioId,
    })
);
