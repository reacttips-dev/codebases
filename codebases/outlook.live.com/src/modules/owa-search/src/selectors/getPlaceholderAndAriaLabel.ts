import { SearchPlaceholder } from 'owa-locstrings/lib/strings/searchplaceholder.locstring.json';
import loc from 'owa-localize';
import isSearchBoxEmpty from './isSearchBoxEmpty';
import type { SearchScenarioId } from 'owa-search-store';

/**
 * Returns the placeholder and aria label for the search input component.
 * Set the placeholder as the search placeholder, parameter placeholder, or "".
 * Set the aria label as the search or parameter placeholder.
 */
export default function getPlaceholderAndAriaLabel(
    scenarioId: SearchScenarioId,
    searchPlaceHolderText: string
) {
    const placeholderText = searchPlaceHolderText ? searchPlaceHolderText : loc(SearchPlaceholder);

    let searchPlaceholder = placeholderText;

    // Show parameter placeholder text when the search box is empty
    if (!isSearchBoxEmpty(scenarioId)) {
        searchPlaceholder = '';
    }

    return {
        ariaLabel: placeholderText,
        placeholder: searchPlaceholder,
    };
}
