import type MailListTableProps from './types/MailListTableProps';
import { isGroupTableQuery } from 'owa-group-utils';
import shouldTableShowCirclePersonas from './shouldTableShowCirclePersonas';
import { shouldTableSupportFlag } from './shouldTableSupportFlag';
import { shouldTableSortByRenewTime } from 'owa-mail-list-response-processor';
import { isDumpsterSearchTable } from 'owa-mail-list-search';
import { isDumpsterTable, listViewStore, TableQueryType } from 'owa-mail-list-store';
import shouldShowFolderTag from '../selectors/shouldShowFolderTag';
import { getStore as getMailSearchStore } from 'owa-mail-search/lib/store/store';
import type { PrimaryMailboxSearchScope } from 'owa-search-service/lib/data/schema/SearchScope';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { isSingleLineListView } from 'owa-mail-layout';

export default function getMailListTableProps(tableViewId: string): MailListTableProps {
    const tableView = listViewStore.tableViews.get(tableViewId);
    const tableQuery = tableView.tableQuery;
    const isDumpsterOrDumpsterSearchTable =
        isDumpsterTable(tableQuery) || isDumpsterSearchTable(tableQuery);
    const tableSupportsPinning = shouldTableSortByRenewTime(tableQuery);
    const tableSupportsSnooze = !isGroupTableQuery(tableQuery);
    const staticSearchScope = getMailSearchStore().staticSearchScope;

    // Show condensed pinned rows only if table supports pinning and is of type Folder
    // as Search table also supports pinning
    const tableSupportsCondensedPinnedRows =
        tableView.tableQuery.type === TableQueryType.Folder && tableSupportsPinning;

    // The ability to show preview text in list view can be disabled by OWA policy setting
    const showPreviewTextDisabled =
        getUserConfiguration().PolicySettings.MessagePreviewsDisabled == true;

    // As we do not support moving all items in the folder, we disable dragging
    // in select all mode. We also disable dragging from Group table as that is not supported.
    const canDragFromTable =
        (tableQuery.folderId !== folderNameToId('notes') &&
            !tableView.isInVirtualSelectAllMode &&
            tableView.tableQuery.type == TableQueryType.Folder) ||
        tableView.tableQuery.type == TableQueryType.Search;

    const isDraggable = tableView.tableQuery.type != TableQueryType.Group;

    const draftsId = folderNameToId('drafts');
    const sentItemsId = folderNameToId('sentitems');

    const isSearchNotInDraftOrSentItemFolder =
        tableView.tableQuery.type == TableQueryType.Search &&
        staticSearchScope &&
        (staticSearchScope as PrimaryMailboxSearchScope).folderId != sentItemsId &&
        (staticSearchScope as PrimaryMailboxSearchScope).folderId != draftsId;

    return {
        tableViewId: tableViewId,
        supportsPinning: tableSupportsPinning,
        supportsFlagging: shouldTableSupportFlag(tableQuery),
        showCirclePersonas: shouldTableShowCirclePersonas(tableQuery),
        showPreviewText:
            getUserConfiguration().UserOptions.ShowPreviewTextInListView &&
            !showPreviewTextDisabled,
        isSearchNotInDraftOrSentItemFolder: isSearchNotInDraftOrSentItemFolder,
        isSingleLine: isSingleLineListView(),
        highlightTerms: tableView.highlightTerms,
        listViewType: tableQuery.listViewType,
        showCondensedPinnedRows: tableSupportsCondensedPinnedRows,
        supportsHoverIcons: !isDumpsterOrDumpsterSearchTable,
        supportsDoubleClick: !isDumpsterOrDumpsterSearchTable,
        showFolderTag: shouldShowFolderTag(tableQuery),
        supportsSnooze: tableSupportsSnooze,
        canDragFromTable: canDragFromTable,
        isDraggable: isDraggable,
    };
}
