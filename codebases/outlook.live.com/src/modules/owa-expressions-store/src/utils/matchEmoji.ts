import matchEmojiKeywords from './matchEmojiKeywords';
import matchEmojiShortcodes from './matchEmojiShortcodes';
import matchEmojiShortcut from './matchEmojiShortcut';

/**
 * Ranking given to a match depending on the type
 * We currently have five rankings:
 * shortcut match: 15
 * full shortcode match: 10
 * partial shortcode match on begin: 6
 * full keyword match: 5
 * partial keyword match on begin: 1
 */
const SHORTCUTMATCH_RANKING = 15;
const SHORTCODE_FULLMATCH_RANKING = 10;
const SHORTCODE_BEGINMATCH_RANKING = 6;
const FULLMATCH_RANKING = 5;
const BEGINMATCH_RANKING = 1;

/**
 * Add an emoji map to the result list, updating ranking accordingly
 */
function addMatchResult(
    resultMap: { [name: string]: MatchRelevance },
    emoji: string,
    ranking: number
) {
    let relevance: MatchRelevance = resultMap[emoji];
    if (relevance) {
        relevance.ranking = relevance.ranking + ranking;
    } else {
        resultMap[emoji] = { emoji: emoji, ranking: ranking };
    }
}

/**
 * Add all matching emojis to the result list with the appropriate ranking
 */
function addMatchingEmojis(
    resultMap: { [name: string]: MatchRelevance },
    matchingEmojis: string[],
    ranking: number
) {
    if (matchingEmojis) {
        for (let emojiFromIndexMatch of matchingEmojis) {
            addMatchResult(resultMap, emojiFromIndexMatch, ranking);
        }
    }
}

/**
 * Match on shortcut and add it to result map
 */
function matchOnShortcut(word: string, resultMap: { [name: string]: MatchRelevance }): boolean {
    // First match on shortcut
    let emoji = matchEmojiShortcut(word);
    if (!emoji) {
        return false;
    }

    addMatchResult(resultMap, emoji, SHORTCUTMATCH_RANKING);
    return true;
}

/**
 * Match on shortcodes / keywords and add it to result map
 */
function matchOnShortcodesAndKeywords(word: string, resultMap: { [name: string]: MatchRelevance }) {
    addMatchingEmojis(
        resultMap,
        matchEmojiShortcodes(word, true /* exactDataOnly */),
        SHORTCODE_FULLMATCH_RANKING
    );
    addMatchingEmojis(resultMap, matchEmojiShortcodes(word), SHORTCODE_BEGINMATCH_RANKING);
    addMatchingEmojis(
        resultMap,
        matchEmojiKeywords(word, true /* exactDataOnly */),
        FULLMATCH_RANKING
    );
    addMatchingEmojis(resultMap, matchEmojiKeywords(word), BEGINMATCH_RANKING);
}

/**
 * Get emojis from result map
 */
function getEmojisFromResultMap(resultMap: { [name: string]: MatchRelevance }): string[] {
    // At this point, we have the result in resultMap, let's sort it by relevance ranking
    let emojisWithRelevance: MatchRelevance[] = [];
    Object.keys(resultMap).map(name => {
        emojisWithRelevance.push(resultMap[name]);
    });

    emojisWithRelevance.sort((a: MatchRelevance, b: MatchRelevance): number => {
        return b.ranking - a.ranking;
    });

    // Return the emoji in the order of relevance from high to low
    let matchedEmojis = [];
    if (emojisWithRelevance.length > 0) {
        for (let i = 0; i < emojisWithRelevance.length; i++) {
            matchedEmojis.push(emojisWithRelevance[i].emoji);
        }
    }

    return matchedEmojis;
}

/**
 * This is used in search to store a matched result
 * It uses ranking to indicate how much the result is relevant to the search term.
 * Higher the ranking, more relevant otherwise less relevant.
 * The ranking is given depending on how the term is matched.
 * shortcut match: +15
 * whole shortcode match: +10
 * partial shortcode match: +6
 * whole keyword match: + 5
 * partial keyword match: +1
 */
export interface MatchRelevance {
    emoji: string;
    ranking: number;
}

/**
 * Match on shortcut
 */
export function matchShortcut(term: string): string {
    let resultMap: { [name: string]: MatchRelevance } = {};

    return matchOnShortcut(term, resultMap) ? getEmojisFromResultMap(resultMap)[0] : null;
}

/**
 * Match emojis with a single search term
 */
export function matchKeyword(term: string): string[] {
    let resultMap: { [name: string]: MatchRelevance } = {};

    // Match on shortcodes / keywords
    matchOnShortcodesAndKeywords(term.toLowerCase(), resultMap);

    return getEmojisFromResultMap(resultMap);
}

/**
 * Update result map based on shortcut, shortcode, and keyword match
 */
function updateResultMap(searchTerm: string, resultMap: { [name: string]: MatchRelevance }) {
    if (matchOnShortcut(searchTerm, resultMap)) {
        // When it is a match with shortcut, no need to continue matching (on keywords)
        return;
    }

    // Match on shortcodes and keywords
    matchOnShortcodesAndKeywords(searchTerm, resultMap);
}

/**
 * Match emojis with a search term
 */
export default function matchEmoji(term: string): string[] {
    let resultMap: { [name: string]: MatchRelevance } = {};

    // Search the whole search term
    if (term) {
        updateResultMap(term.toLowerCase(), resultMap);
    }

    return getEmojisFromResultMap(resultMap);
}
