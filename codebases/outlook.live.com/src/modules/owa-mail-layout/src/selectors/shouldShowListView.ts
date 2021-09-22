import { getStore } from '../store/Store';

/**
 * Returns a flag indicating whether to show list view or not
 */
export function shouldShowListView() {
    return getStore().showListPane;
}
