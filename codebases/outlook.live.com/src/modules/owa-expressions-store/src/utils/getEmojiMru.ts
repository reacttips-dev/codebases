import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

/**
 * For legacy reason (jsMVVM), emoji Mru is stored in user configuration as an array of emoji css class name
 * i.e. csimg image-emoji_01f1-png
 * This regex is used to extract emoji key from an emoji css name
 */
const EMOJI_REGX: RegExp = /emoji_([0-9a-z]+(_[0-9a-z]+)?)-png/i;

/**
 * Max number of emojis to keep in MRU
 */
export const EMOJI_MAX_MRU = 49;

/**
 * Get emojis MRU in list of emoji key code
 */
export default function getEmojiMru(numMruToFetch: number = EMOJI_MAX_MRU): string[] {
    let emojisInCssName = getUserConfiguration().UserOptions.MruEmojis;
    let emojis = [];
    if (emojisInCssName && emojisInCssName.length > 0) {
        for (let cssName of emojisInCssName) {
            // EMOJI_REGX is a group match, it should return a result that has at least 2 matches
            // The first is a whole match for the key portion of the emoji
            let matches = cssName.match(EMOJI_REGX);
            if (matches && matches.length >= 2) {
                emojis.push(matches[1].toLowerCase());
                if (emojis.length >= numMruToFetch) {
                    break;
                }
            }
        }
    }

    return emojis;
}
