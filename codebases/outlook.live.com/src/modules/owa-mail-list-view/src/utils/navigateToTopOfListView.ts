import { getStore as getListViewStore } from 'owa-mail-list-store/lib/store/Store';
import type MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';

export function navigateToTopOfListView(
    tableViewId: string,
    selectionSource: MailListItemSelectionSource,
    isNewFolderSameAsPreviousFolder?: boolean,
    isInImmersiveView?: boolean
) {
    // Check if there is a tableview Id, in some selections there are none. We also want to preserve the position if
    // reading pane is shown.
    if (!tableViewId || isNewFolderSameAsPreviousFolder === false || isInImmersiveView) {
        return;
    }
    const tableView = getListViewStore().tableViews.get(tableViewId);
    // TableView can be undefined. if the tableviewid has not been stored in the cache.
    if (!tableView) {
        return;
    }

    // Manually scroll to first row, the reading pane will clear when it does.
    document.getElementById(tableView.rowKeys[0])?.scrollIntoView();
}
