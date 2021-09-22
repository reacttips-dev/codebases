import type Emoji from '../store/schema/Emoji';
import getEmojiList from './getEmojiList';
import { computed, IComputedValue } from 'mobx';
import { PrefixMap, Trie } from 'owa-data-structures';

/**
 * Global variable that stores a sorted Trie of keywords to Emojis
 */
let emojiKeywordTrie: IComputedValue<PrefixMap<string>> = computed(() => {
    let keywordTrie: PrefixMap<string> = new Trie<string>();

    for (let emoji of getEmojiList()) {
        const keywordString = emoji.keywords; // Keywords are stored comma-separated, e.g. nerdy,dork,dweeb
        if (!keywordString) {
            continue;
        }

        const keywords = keywordString.split(',');
        if (!keywords || keywords.length < 1) {
            continue;
        }

        // Add keywords to index
        processEmojiKeywords(keywordTrie, emoji, keywords);
    }

    return keywordTrie;
});

/**
 * Add an emoji to index map per keywords
 */
function processEmojiKeywords(keywordTrie: PrefixMap<string>, emoji: Emoji, keywords: string[]) {
    // Shortcodes are stored as the first keyword
    // If shortcodes are multiple words, e.g. sneezing achoo, store each as a keyword
    const shortcode = keywords[0];
    const shortcodeTerms = shortcode.split(/\s/g);
    for (let shortcodeTerm of shortcodeTerms) {
        keywordTrie.addWordAndData(shortcodeTerm.toLowerCase(), emoji.key);
    }

    // Add the rest of the keywords to the keyword trie
    for (let i = 1; i < keywords.length; i++) {
        const keyword = keywords[i];
        keywordTrie.addWordAndData(keyword.toLowerCase(), emoji.key);
    }
}

export default function matchEmojiKeywords(word: string, exactDataOnly?: boolean) {
    return emojiKeywordTrie.get().getDataForWord(word, exactDataOnly);
}
