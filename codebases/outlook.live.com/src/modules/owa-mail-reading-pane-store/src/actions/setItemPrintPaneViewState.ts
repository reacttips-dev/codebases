import type ItemReadingPaneViewState from '../store/schema/ItemReadingPaneViewState';
import readingPaneStore from '../store/Store';
import { action } from 'satcheljs/lib/legacy';

export default action('setItemPrintPaneViewState')(function setItemPrintPaneViewState(
    viewState: ItemReadingPaneViewState
) {
    readingPaneStore.itemPrintPaneViewState = viewState;
});
