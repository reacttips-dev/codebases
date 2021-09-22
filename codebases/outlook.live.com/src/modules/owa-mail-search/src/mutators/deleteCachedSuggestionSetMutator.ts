import { deleteCachedSuggestionSet } from '../actions/internalActions';
import { getStore } from '../store/store';
import { mutator } from 'satcheljs';

export default mutator(deleteCachedSuggestionSet, actionMessage => {
    getStore().legacySuggestions.delete(actionMessage.searchText);
});
