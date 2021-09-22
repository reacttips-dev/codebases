import { getStore } from '../store/Store';

export default function isItemReadingPaneViewStateLoaded(itemId: string): boolean {
    return getStore().loadedItemReadingPaneViewStates.has(itemId);
}
