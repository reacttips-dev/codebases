import { action } from 'satcheljs/lib/legacy';
import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';

export default action('setIsSearching')(function setIsSearching(
    viewstate: FindControlViewState,
    isSearching: boolean
) {
    if (viewstate.isSearching != isSearching) {
        viewstate.isSearching = isSearching;
    }
});
