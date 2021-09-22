import trieStore from '../store/store';

export default function isSuggestionTrieEmpty(): boolean {
    return trieStore.recipientTrie == null;
}
