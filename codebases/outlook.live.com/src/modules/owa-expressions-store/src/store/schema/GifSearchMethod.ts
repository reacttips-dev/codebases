import { assertNever } from 'owa-assert';

export const EXPRESSION_PANE_SEARCH_METHOD = 'expressionPaneSearch';
export const INLINE_SEARCH_METHOD = 'inlineSearch';
export const SMART_SUGGESTIONS_SEARCH_METHOD = 'smartSuggestionsSearch';

export function getSearchFormValue(searchMethod: GifSearchMethod): string {
    switch (searchMethod) {
        case EXPRESSION_PANE_SEARCH_METHOD:
            return 'OWAGSH';
        case INLINE_SEARCH_METHOD:
            return 'OWASFO';
        case SMART_SUGGESTIONS_SEARCH_METHOD:
            return 'OWAGCS';
        default:
            throw assertNever(searchMethod);
    }
}

type GifSearchMethod = 'expressionPaneSearch' | 'inlineSearch' | 'smartSuggestionsSearch';

export default GifSearchMethod;
