import ExpressionPage from '../store/schema/ExpressionPage';
import type ExpressionPickerViewState from '../store/schema/ExpressionPickerViewState';
import type GifSearchMethod from '../store/schema/GifSearchMethod';
import getPopularEmoji from '../utils/getPopularEmoji';
import matchEmoji from '../utils/matchEmoji';
import matchGif from '../utils/matchGif';
import startSearch from './startSearch';
import stopSearch from './stopSearch';
import updateGifResults from './updateGifResults';
import updateEmojiResults from './updateEmojiResults';

export default async function updateSearch(
    state: ExpressionPickerViewState,
    searchTerm: string,
    searchMethod: GifSearchMethod,
    gifDummyCallback?: () => void
) {
    if (searchTerm === state.searchTerm) {
        // If the search query match the term in the searchbox, the results are already up to date
        return;
    }

    startSearch(state, searchTerm);

    if (searchTerm) {
        // Perform search and update GIFs and emoji with results accordingly
        if (state.gifPickerViewState) {
            const results = await matchGif(
                state.gifPickerViewState,
                searchTerm,
                searchMethod,
                gifDummyCallback
            );
            updateGifResults(state, results);
        }
        updateEmojiResults(state, matchEmoji(searchTerm));
        if (state.page !== ExpressionPage.Gifs) {
            state.numSearchesToInsertEmoji++;
        }
    } else {
        // Reset search results on empty query
        if (state.gifPickerViewState) {
            updateGifResults(state, null);
        }
        updateEmojiResults(state, getPopularEmoji());
    }

    stopSearch(state);
}
