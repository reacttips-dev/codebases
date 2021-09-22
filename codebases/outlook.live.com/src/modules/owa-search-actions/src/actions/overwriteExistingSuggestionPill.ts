import { mutatorAction } from 'satcheljs';
import type { PillSuggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';

export const overwriteExistingSuggestionPill = mutatorAction(
    'OVERWRITE_EXISTING_SUGGESTION_PILL',
    (newPill: PillSuggestion, existingPillId: string, scenarioId: SearchScenarioId) => {
        const searchStore = getScenarioStore(scenarioId);
        const newPillId = newPill.ReferenceId;

        /**
         * Remove the existing pill and add the incoming pill
         */
        searchStore.suggestionPills.delete(existingPillId);
        searchStore.suggestionPills.set(newPillId, newPill);

        /**
         * Replace the existingPillId with the newPillId in place to preserve pill order
         */
        const indexOfExistingPill = searchStore.suggestionPillIds.indexOf(existingPillId);
        searchStore.suggestionPillIds[indexOfExistingPill] = newPillId;
    }
);
