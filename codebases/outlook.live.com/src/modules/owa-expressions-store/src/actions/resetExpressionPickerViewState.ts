import setEmojiCategoryIndex from './setEmojiCategoryIndex';
import setExpressionPickerIsOpen from './setExpressionPickerIsOpen';
import setExpressionPickerOpenedSource from './setExpressionPickerOpenedSource';
import setShouldRestoreSelectionAfterInsertNode from './setShouldRestoreSelectionAfterInsertNode';
import setWordToReplace from './setWordToReplace';
import updateExpressionPage from './updateExpressionPage';
import resetNumSearchesToInsertEmoji from '../actions/resetNumSearchesToInsertEmoji';
import saveEmojiSkinToneToServer from '../actions/saveEmojiSkinToneToServer';
import updateSearch from '../actions/updateSearch';
import ExpressionPage from '../store/schema/ExpressionPage';
import isGifPickerEnabled from '../utils/isGifPickerEnabled';
import type ExpressionPickerViewState from '../store/schema/ExpressionPickerViewState';
import { isBrowserIE } from 'owa-user-agent/lib/userAgent';
import { action, orchestrator } from 'satcheljs';

const resetExpressionPickerViewState = action(
    'resetExpressionPickerViewState',
    (viewState: ExpressionPickerViewState) => ({ viewState: viewState })
);

orchestrator(resetExpressionPickerViewState, actionMessage => {
    const { viewState } = actionMessage;

    setExpressionPickerIsOpen(viewState, false);
    if (viewState.searchTerm) {
        // Reset isSearching, searchTerm, emojiPickerViewState, gifPickerViewState properties
        updateSearch(viewState, '' /* searchTerm */, null /* searchMethod */);
    }
    updateExpressionPage(
        viewState,
        isGifPickerEnabled() ? ExpressionPage.All.toString() : ExpressionPage.Emojis.toString()
    );
    setWordToReplace(viewState, '');
    resetNumSearchesToInsertEmoji(viewState);
    setEmojiCategoryIndex(viewState, 0);
    setExpressionPickerOpenedSource(viewState, null);
    setShouldRestoreSelectionAfterInsertNode(viewState, false);

    if (!isBrowserIE()) {
        saveEmojiSkinToneToServer(true);
    }
});

export default resetExpressionPickerViewState;
