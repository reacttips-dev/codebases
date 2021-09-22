import getEmojiMru from './getEmojiMru';
import { EMOJI_HOMEPAGE_COUNT } from '../store/schema/EmojiPickerViewState';

const MAX_MRU_EMOJI = 14;
/* Popular emoji list curated using http://www.emojitracker.com/ */
const POPULAR_EMOJI_LIST = [
    '1f602', // 😂
    '2764', // ♥
    '1f60d', // 😍
    '1f62d', // 😭
    '1f60a', // 😊
    '1f612', // 😒
    '1f495', // 💕
    '1f618', // 😘
    '267b', // ♻
    '1f629', // 😩
    '1f44c', // 👌
    '1f60f', // 😏
    '1f601', // 😁
    '1f609', // 😉
    '1f44d', // 👍
    '2b05', // ⬅
    '1f60c', // 😌
    '1f64f', // 🙏
    '1f914', // 🤔
    '1f622', // 😢
    '1f60e', // 😎
    '1f633', // 😳
    '1f440', // 👀
    '1f605', // 😅
    '1f64c', // 🙌
    '1f494', // 💔
    '1f648', // 🙈
    '270c', // ✌
    '2728', // ✨
    '1f499', // 💙
    '1f49c', // 💜
    '1f4af', // 💯
    '1f604', // 😄
    '1f496', // 💖
    '1f61c', // 😜
];

/**
 * Get the 35 popular emojis to show in the home section
 * The first two rows (7 emoji/row) should be MRU
 * Backfill the rest with popular emojis to show a total of 35
 */
export default function getPopularEmoji(numToFetch: number = EMOJI_HOMEPAGE_COUNT): string[] {
    let popularEmoji: string[] = getEmojiMru(Math.min(numToFetch, MAX_MRU_EMOJI));

    for (let i = 0; popularEmoji.length < numToFetch; i++) {
        let emoji = POPULAR_EMOJI_LIST[i];
        if (!popularEmoji.includes(emoji)) {
            popularEmoji.push(emoji);
        }
    }

    return popularEmoji;
}
