import GifSearchMethod, { getSearchFormValue } from '../store/schema/GifSearchMethod';
import { logUsage } from 'owa-analytics';
import { format } from 'owa-localize';

const DUMMY_URL = 'https://www.bing.com/images/search?q={0}&FORM={1}';
export const DUMMY_TIMEOUT = 3000;

/**
 * Make dummy call for GIF search so Bing team can monitor traffic (VSO 40256)
 * Queries count towards comScore in these cases:
 * 1. The user hits enter in the search box
 * 2. Three seconds pass before the user enters another stroke in the search box
 * 3. GIF search is activated via smart suggestions or "..." in the inline emoji picker
 */
export default function makeDummyCallForGifSearch(
    searchTerm: string,
    searchMethod: GifSearchMethod
) {
    // Don't count empty search queries
    if (!searchTerm) {
        return;
    }

    try {
        const dummyUrl = format(
            DUMMY_URL,
            encodeURIComponent(searchTerm),
            getSearchFormValue(searchMethod)
        );
        let dummyRequest = new XMLHttpRequest();
        dummyRequest.open('GET', dummyUrl, true);
        dummyRequest.send();
        logUsage('ExpressionPicker_GifDummyCallMade');
    } catch {}
}
