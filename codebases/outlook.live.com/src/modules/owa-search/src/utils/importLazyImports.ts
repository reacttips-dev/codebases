import { lazyIsSearchBoxEmpty, lazySetSpellerData } from '../lazyFunctions';

import {
    lazyClearSearchBox,
    lazyEndSearchSession,
    lazyRemoveSuggestionPillFromSearchBox,
} from 'owa-search-actions';

/**
 * This helper function is called after a search session starts, and helps pre-load
 * lazily loaded imports to improve the user experience.
 */
export default function importLazyImports() {
    lazyClearSearchBox.import();
    lazyEndSearchSession.import();
    lazyIsSearchBoxEmpty.import();
    lazyRemoveSuggestionPillFromSearchBox.import();
    lazySetSpellerData.import();
}
