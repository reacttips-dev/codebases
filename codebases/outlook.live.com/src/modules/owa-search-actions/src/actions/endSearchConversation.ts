import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';

// Action dispatched when a 3S conversation ends.
export const endSearchConversation = action(
    'END_SEARCH_CONVERSATION',
    (scenarioId: SearchScenarioId) => ({
        scenarioId,
    })
);
