import { unsubscribeFromUnreadNotifications } from './groupsUnreadNotificationsStrategy';
import { loadGroups } from './loadGroups';
import removeGroupFromLeftNav from './removeGroupFromLeftNav';
import { getLeftNavGroupsStore } from 'owa-group-left-nav';
import getGroupDetailsAction from 'owa-groups-shared-actions/lib/getGroupDetailsAction';
import { getGroupsStore } from 'owa-groups-shared-store/lib/GroupsStore';
import { getSelectedTableView } from 'owa-mail-list-store';
import TableOperations from 'owa-mail-list-table-operations';
import { getGroupIdFromTableQuery } from 'owa-group-utils';
import {
    loadTableViewFromTableQuery,
    setTableViewErrorState,
} from 'owa-mail-table-loading-actions';
import { lazySetGroupIsMember } from 'owa-group-shared-actions';
import { subscribe, GroupAssociationNotificationPayload } from 'owa-group-association-notification';
import UnifiedGroupAccessType from 'owa-service/lib/contract/UnifiedGroupAccessType';

function onGroupAssociationNotificationCallback(
    notification: GroupAssociationNotificationPayload
): void {
    if (notification.EventType == 'RowModified' || notification.EventType == 'RowAdded') {
        if (notification.IsMember != null && notification.Group != null) {
            const groupSmtp = notification.Group.SmtpAddress.toLowerCase();
            lazySetGroupIsMember.importAndExecute(groupSmtp, notification.IsMember);

            const leftNavGroupsStore = getLeftNavGroupsStore();
            if (notification.IsMember) {
                if (!leftNavGroupsStore.myOrgGroups.includes(groupSmtp)) {
                    // joined group, reload left nav (this will also subscribe to unread)
                    loadGroups();
                    updateTableViewIfInGroup(groupSmtp);
                }
            } else {
                if (leftNavGroupsStore.myOrgGroups.includes(groupSmtp)) {
                    // left group, remove from left nav, unsubscribe from unread
                    // and getGroupDetails so the header is updated accordingly
                    removeGroupFromLeftNav(groupSmtp, leftNavGroupsStore);
                    unsubscribeFromUnreadNotifications(groupSmtp);
                    getGroupDetailsAction(groupSmtp);
                    markGroupAsPrivateIfNeeded(groupSmtp);
                }
            }
        }
    }
}

// If the affected group is currently selected, reload
// the table so the listview is up to date
function updateTableViewIfInGroup(groupSmtp: string) {
    const tableView = getSelectedTableView();
    const groupId = tableView && getGroupIdFromTableQuery(tableView.tableQuery);
    if (groupId && groupId.toLowerCase() === groupSmtp) {
        loadTableViewFromTableQuery(tableView.tableQuery);
    }
}

function markGroupAsPrivateIfNeeded(groupSmtp: string) {
    const tableView = getSelectedTableView();
    const groupId = tableView && getGroupIdFromTableQuery(tableView.tableQuery);
    if (groupId?.toLowerCase() !== groupSmtp) {
        return;
    }

    const groupsStore = getGroupsStore();
    const groupInformation = groupsStore.groups.get(groupSmtp);

    // In case the group is private make sure the user see reading pane as private.
    if (groupInformation?.basicInformation?.AccessType !== UnifiedGroupAccessType.Public) {
        // Clear all rows in the current
        TableOperations.clear(tableView, null /* skipRowsNewerThanTime*/);

        // Set reading pane to be private
        setTableViewErrorState(tableView, 'ErrorAccessDenied');
    }
}

export function subscribeToGroupAssociationNotifications(): void {
    subscribe(onGroupAssociationNotificationCallback);
}
