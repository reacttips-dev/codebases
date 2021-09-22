import { updateIsSuggestionSetComplete } from '../actions/internalActions';
import { getStore } from '../store/store';
import { mutator } from 'satcheljs';

export default mutator(updateIsSuggestionSetComplete, actionMessage => {
    const cachedSuggestionSets = getStore().legacySuggestions;

    /**
     * If a cached suggestion set for the given search text exists in the store,
     * retrieve it and mark "IsComplete" with given value.
     */
    if (cachedSuggestionSets.has(actionMessage.searchText)) {
        const cachedSuggestionSet = cachedSuggestionSets.get(actionMessage.searchText);
        cachedSuggestionSet.IsComplete = actionMessage.isComplete;
    }
});
