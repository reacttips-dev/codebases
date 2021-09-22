import type Emoji from '../store/schema/Emoji';
import getEmojiList from './getEmojiList';
import { computed, IComputedValue } from 'mobx';
import { PrefixMap, Trie } from 'owa-data-structures';

/**
 * Global variable that stores a sorted Trie of shortcodes to Emojis
 */
let emojiShortcodeTrie: IComputedValue<PrefixMap<string>> = computed(() => {
    let shortcodeTrie: PrefixMap<string> = new Trie<string>();

    for (let emoji of getEmojiList()) {
        const shortcode = emoji.description;
        if (!shortcode) {
            continue;
        }

        // Add shortcodes to index
        processEmojiShortcodes(shortcodeTrie, emoji, shortcode);
    }

    return shortcodeTrie;
});

/**
 * Add an emoji to index map per shortcodes
 */
function processEmojiShortcodes(shortcodeTrie: PrefixMap<string>, emoji: Emoji, shortcode: string) {
    shortcodeTrie.addWordAndData(shortcode.toLowerCase(), emoji.key);
}

export default function matchEmojiShortcodes(word: string, exactDataOnly?: boolean) {
    return emojiShortcodeTrie.get().getDataForWord(word, exactDataOnly);
}
