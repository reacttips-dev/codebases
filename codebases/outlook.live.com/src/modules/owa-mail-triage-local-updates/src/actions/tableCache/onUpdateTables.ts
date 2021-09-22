import type { TableView } from 'owa-mail-list-store';
import {
    lazySubscribeToRowNotifications,
    lazyUnsubscribeToRowNotifications,
} from 'owa-mail-triage-notifications';
import { lazyRemoveTableFromStore } from '../../index';

// Subscribe to notifications for new table
export function onAddTable(tableView: TableView) {
    lazySubscribeToRowNotifications.importAndExecute(tableView);
}

// Unsubscribe from notifications and remove the table from the store
export function onRemoveTable(tableViewId: string) {
    lazyUnsubscribeToRowNotifications.importAndExecute(tableViewId);
    lazyRemoveTableFromStore.importAndExecute(tableViewId);
}
