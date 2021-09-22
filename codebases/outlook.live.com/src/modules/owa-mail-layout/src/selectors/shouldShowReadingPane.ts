import { getStore } from '../store/Store';

/**
 * Returns a flag indicating whether to show reading pane or not
 */
export function shouldShowReadingPane() {
    return getStore().showReadingPane;
}
