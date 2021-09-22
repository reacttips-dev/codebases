export interface EmojiPickerViewState {
    /**
     * Array of emoji keys to show in emoji search panel.
     * The string is a key to an emoji. The real emoji can
     * be dereferenced through getEmoji util.
     */
    emojiResults: string[];
    defaultInsertEmoji?: (emoji: string) => void;
}

export const EMOJI_HOMEPAGE_COUNT = 35;

export default EmojiPickerViewState;
