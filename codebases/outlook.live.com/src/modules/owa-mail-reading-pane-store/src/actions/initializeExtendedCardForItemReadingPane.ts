import type ItemReadingPaneViewState from '../store/schema/ItemReadingPaneViewState';
import type { ClientItem } from 'owa-mail-store';
import { action } from 'satcheljs';

export default action(
    'initializeExtendedCardForItemReadingPane',
    (itemReadingPaneViewState: ItemReadingPaneViewState, loadedItem: ClientItem) => ({
        itemReadingPaneViewState: itemReadingPaneViewState,
        loadedItem: loadedItem,
    })
);
