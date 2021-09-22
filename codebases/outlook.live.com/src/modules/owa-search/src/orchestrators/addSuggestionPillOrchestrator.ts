import getMatchingSuggestionPillInSearchBox from '../selectors/getMatchingSuggestionPillInSearchBox';
import {
    addSuggestionPill,
    addSuggestionPillInternal,
    overwriteExistingSuggestionPill,
    onSearchTextChanged,
    setSearchTextForSuggestion,
} from 'owa-search-actions';
import { orchestrator } from 'satcheljs';
import type { PillSuggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';

export default orchestrator(addSuggestionPill, actionMessage => {
    const scenarioId = actionMessage.scenarioId;
    const suggestionPill: PillSuggestion = actionMessage.suggestionPill;

    // If payload is invalid then bail.
    if (!suggestionPill) {
        return;
    }

    /**
     * Only add suggestion to collection of suggestion pills if it hasn't already
     * been added.
     */
    const duplicateSuggestionId = getMatchingSuggestionPillInSearchBox(suggestionPill, scenarioId);
    if (!duplicateSuggestionId) {
        /**
         * Add the suggestion pill to the collection, as well as adding its ID to
         * the array of IDs to maintain order.
         */
        addSuggestionPillInternal(suggestionPill, scenarioId);
    } else {
        // Overwrite existing pill with new pill
        overwriteExistingSuggestionPill(suggestionPill, duplicateSuggestionId, scenarioId);
    }

    // Clear search text (since suggestion pill was picked based on search text).
    if (actionMessage.suggestionSelected) {
        onSearchTextChanged('', scenarioId);
        setSearchTextForSuggestion('', scenarioId);
    }
});
