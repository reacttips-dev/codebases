import type { EmojiPickerViewState } from '../store/schema/EmojiPickerViewState';
import createPickerPluginViewState from 'owa-editor-picker-plugin/lib/utils/createPickerPluginViewState';
import getPopularEmoji from 'owa-expressions-store/lib/utils/getPopularEmoji';

export default function createEmojiPickerViewState(): EmojiPickerViewState {
    let viewState = <EmojiPickerViewState>{
        ...createPickerPluginViewState(),
        emojiResults: getPopularEmoji(),
        queryString: '',
        wordBeforeCursor: '',
        selectedEmojiIndex: 0,
    };

    return viewState;
}
