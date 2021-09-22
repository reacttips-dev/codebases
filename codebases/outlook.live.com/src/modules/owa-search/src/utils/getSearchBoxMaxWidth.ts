import { DEFAULT_COLLAPSED_WIDTH, DEFAULT_EXPANDED_WIDTH } from 'owa-search-constants';

/**
 * This function gets the max width of the search box. If the search box isn't
 * expanded (i.e. user isn't in search session), use custom value provided by
 * consumer (or default value if a custom one wasn't provided). If the search box
 * is expanded, use default max width.
 */
export default function getSearchBoxMaxWidth(
    isSearchBoxExpanded: boolean,
    customCollapsedMaxWidth: number
) {
    if (!isSearchBoxExpanded) {
        return customCollapsedMaxWidth ? customCollapsedMaxWidth : DEFAULT_COLLAPSED_WIDTH;
    } else {
        return DEFAULT_EXPANDED_WIDTH;
    }
}
