import { getStore } from '../store/Store';

/**
 * Returns a flag indicating whether to show the folder pane or not
 */
export function shouldShowFolderPane() {
    return getStore().showFolderPane;
}
