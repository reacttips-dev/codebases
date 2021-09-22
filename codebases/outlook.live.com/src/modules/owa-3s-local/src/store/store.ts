import { createStore } from 'satcheljs';
import type PeopleSuggestionTrieStore from './schema/PeopleSuggestionTrieStore';

var initialPeopleSuggestionStore: PeopleSuggestionTrieStore = {
    recipientTrie: null,
};

var store = createStore<PeopleSuggestionTrieStore>(
    'peoplesuggestiontriestore',
    initialPeopleSuggestionStore
)();

export default store;
