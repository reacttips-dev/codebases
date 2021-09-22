import { isFeatureEnabled } from 'owa-feature-flags';
import { DESCENDING_SORT_DIR } from 'owa-mail-list-store/lib/utils/sort/mailSortHelper';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import {
    getSelectedTableView,
    getViewFilterForTable,
    getFocusedFilterForTable,
    SortColumn,
    listViewStore,
    TableView,
    getSortByForTable,
    TableQueryType,
} from 'owa-mail-list-store';
import {
    getIsBitSet,
    FocusedInboxBitFlagsMasks,
} from 'owa-bit-flags/lib/utils/focusedInboxBitFlagConstants';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { logUsage } from 'owa-analytics';

let isNudgeEnabledForTenantLogged;

// Check flight, user and tenant settings
export function isNudgeEnabled() {
    const isConsumerSession = isConsumer();
    const isNudgeEnabledForConsumers = isConsumerSession && isFeatureEnabled('tri-nudge-consumer');
    const isNudgeEnabledForEnterprise = !isConsumerSession && isFeatureEnabled('tri-nudge');
    const isNudgeEnabledForTenant = getUserConfiguration().UserOptions.MessageRemindersEnabled;

    if (!isNudgeEnabledForTenantLogged) {
        isNudgeEnabledForTenantLogged = true;
        logUsage('Nudge_TenantSetting', {
            owa_1: isNudgeEnabledForTenant,
        });
    }

    return (
        isNudgeEnabledForTenant &&
        (isNudgeEnabledForEnterprise || isNudgeEnabledForConsumers) &&
        !getIsBitSet(FocusedInboxBitFlagsMasks.IsNudgeDisabled)
    );
}

function isNudgeEnabledForFolder(folderId: string) {
    // nudge is only supported in inbox or sent items folder
    return folderId === folderNameToId('inbox') || folderId === folderNameToId('sentitems');
}

function isNudgeEnabledForView(tableView: TableView, folderId: string) {
    // Nudge is only supported in folder table types (and not in Search/Groups)
    if (tableView.tableQuery.type != TableQueryType.Folder) {
        return false;
    }

    // nudge is only supported in Inbox or Focused views with no view filter
    if (getViewFilterForTable(tableView) != 'All') {
        return false;
    }

    const focusedViewFilter = getFocusedFilterForTable(tableView);
    if (
        focusedViewFilter != FocusedViewFilter.Focused &&
        focusedViewFilter != FocusedViewFilter.None
    ) {
        return false;
    }

    const sortBy = getSortByForTable(tableView);

    return sortBy.sortColumn == SortColumn.Date && sortBy.sortDirection == DESCENDING_SORT_DIR;
}

export function isNudgeSupportedInTable(tableViewId: string) {
    const tableView = listViewStore.tableViews.get(tableViewId);
    const folderId = tableView.tableQuery.folderId;
    if (!isNudgeEnabledForFolder(folderId)) {
        return false;
    }

    return isNudgeEnabledForView(tableView, folderId);
}

export default function isNudgeSupportedInFolder(folderId: string): boolean {
    if (!isNudgeEnabledForFolder(folderId)) {
        return false;
    }

    const tableView = getSelectedTableView();
    return isNudgeEnabledForView(tableView, folderId);
}
