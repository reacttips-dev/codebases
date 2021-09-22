import getGifSearchResults, { BingGifValue } from '../services/getGifSearchResults';
import makeDummyCallForGifSearch from '../services/makeDummyCallForGifSearch';
import type GifPickerViewState from '../store/schema/GifPickerViewState';
import type GifSearchMethod from '../store/schema/GifSearchMethod';

export default async function matchGif(
    gifPickerViewState: GifPickerViewState,
    searchTerm: string,
    searchMethod: GifSearchMethod,
    gifDummyCallback: () => void = () => makeDummyCallForGifSearch(searchTerm, searchMethod)
): Promise<BingGifValue[]> {
    let gifSearchResults: BingGifValue[];

    try {
        if (gifPickerViewState) {
            gifSearchResults = await getGifSearchResults(
                searchTerm,
                gifPickerViewState.culture,
                searchMethod
            );
            gifDummyCallback();
        } else {
            gifSearchResults = null;
        }
    } catch {
        gifSearchResults = null;
    }

    return gifSearchResults;
}
