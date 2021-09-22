import getSelectedTableView from './getSelectedTableView';
import canTableBeOutOfSyncWithServer from './canTableBeOutOfSyncWithServer';
import LoadErrorStatus from '../store/schema/LoadErrorStatus';
import { MailListViewState } from 'owa-mail-store/lib/store/schema/MailListViewState';
import type { TableView } from '../index';

// Gets the MailList Loading, loaded, Error states
export const getMailListLoadState = (): MailListViewState => {
    const tableView = getSelectedTableView();

    return getMailListLoadStateFromTableView(tableView);
};

export const getMailListLoadStateFromTableView = (
    tableView: TableView | undefined
): MailListViewState => {
    if (!tableView || !tableView.isInitialLoadComplete) {
        return MailListViewState.Loading;
    }

    const isTableEmpty = tableView.rowKeys.length == 0;

    // do not display error if there're cached items in the table to show
    // when error occurs and the table is truly empty, prioritize showing error instead
    // of no items in the list view.
    // For tables tha can be out of sync with the server we want to not show the cached rows
    // as they could be in a different state on the server hence we prioritize showing error for such tables.
    if (
        tableView.loadErrorStatus != LoadErrorStatus.None &&
        (isTableEmpty || canTableBeOutOfSyncWithServer(tableView))
    ) {
        return MailListViewState.Error;
    }

    if (isTableEmpty) {
        return MailListViewState.Empty;
    }

    return MailListViewState.Loaded;
};
