import { getMarkJS } from 'owa-mark/lib/utils/constants';

// used to bypass loading markjs if no
// search terms are ever passed in
let hasEverMarked = false;

export default async function highlightTermsInHtmlElement(
    element: HTMLElement,
    highlightTerms: string[],
    separateWordSearch: boolean = false,
    matchPrefix: boolean = false
) {
    if (element && (highlightTerms?.length || hasEverMarked)) {
        hasEverMarked = true;
        let MarkJS = await getMarkJS();
        let marker = MarkJS.call(MarkJS, element);
        if (highlightTerms?.length) {
            marker.mark(highlightTerms, {
                separateWordSearch: separateWordSearch,
                accuracy: matchPrefix ? 'prefix' : 'partially',
            });
        } else {
            marker.unmark();
        }
    }
}
