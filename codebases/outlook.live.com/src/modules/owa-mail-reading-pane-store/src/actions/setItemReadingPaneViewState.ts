import { addLoadedItemReadingPaneViewState } from '../mutators/loadedItemViewStateMutators';
import type ItemReadingPaneViewState from '../store/schema/ItemReadingPaneViewState';
import { action } from 'satcheljs/lib/legacy';

export default action('setItemReadingPaneViewState')(function setItemReadingPaneViewState(
    viewState: ItemReadingPaneViewState
) {
    addLoadedItemReadingPaneViewState(viewState);
});
