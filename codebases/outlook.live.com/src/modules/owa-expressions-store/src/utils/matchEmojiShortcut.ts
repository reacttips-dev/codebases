let shortcutMap: { [key: string]: string } = null;
let shortcutEnd: string = '';

/**
 * In order to have better performance, we need to:
 * 1. Cache the last character of all emoji shortcuts into a string (shortcutEnd),
 *    and we check if the input key is in this string, otherwise no need to do emoji matching
 * 2. Cache the emoji shortcuts to a static map (shortcutMap), and do emoji matching with this map,
 *    so that we don't need to do heavy emoji calculation when the input is not an emoji.
 *
 */
function getEmojiShortcutMap() {
    if (!shortcutMap) {
        shortcutMap = {
            ':)': '1f642', // 🙂
            ':-)': '1f642', // 🙂
            ':(': '1f641', // 🙁
            ':-(': '1f641', // 🙁
            ':D': '1f604', // 😄
            ':-D': '1f604', // 😄
            ':P': '1f60b', // 😋
            ':-P': '1f60b', // 😋
            ':|': '1f610', // 😑
            ':-|': '1f610', // 😑
            ':/': '1f615', // 😕
            ':-/': '1f615', // 😕
            ':\\': '1f615', // 😕
            ':-\\': '1f615', // 😕
            ':O': '1f62e', // 😮
            ':-O': '1f62e', // 😮
            ':*': '1f617', // 😗
            ':-*': '1f617', // 😗
        };
        shortcutEnd = ')(DP|/\\O*';
    }

    return shortcutMap;
}

/**
 * Match emoji with a shortcut
 */
function matchEmojiShortcut(term: string): string {
    if (!term || term.length == 0) {
        return null;
    }

    return getEmojiShortcutMap()[term];
}

export default matchEmojiShortcut;

// Check if the input is possibly the last char of an emoji shortcut
// If returns false, we can safely skip all emoji mapping code to improve typing perf
export function isPossibleEmojiShortcutEnd(end: string) {
    getEmojiShortcutMap();
    return shortcutEnd.indexOf(end) >= 0;
}
