import getGroupHeaderForSearchTable from './getGroupHeaderForSearchTable';
import getGroupHeaderForSortByDateTime from './getGroupHeaderForSortByDateTime';
import getGroupHeaderForSortBySender from './getGroupHeaderForSortBySender';
import getGroupHeaderForSortBySize from './getGroupHeaderForSortBySize';
import getGroupHeaderForImportance from './getGroupHeaderForImportance';
import type GroupHeaderGenerator from '../type/GroupHeaderGenerator';
import { getIsBitSet, ListViewBitFlagsMasks } from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';
import { shouldTableSortByRenewTime } from 'owa-mail-list-response-processor';
import type { TableView } from 'owa-mail-list-store';
import { mapTableQueryToTableViewOptions } from 'owa-mail-tableview-options';
import { assertNever } from 'owa-assert';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * Gets the header generator depending on the current settings
 * @param tableView for which to get the header generator
 * @returns GroupHeaderGenerator
 */
export default function getMailListGroupHeaderGenerator(
    tableView: TableView
): GroupHeaderGenerator {
    const headerGenerator: GroupHeaderGenerator = {
        getGroupHeader: null,
        hideFirstHeader: false,
    };

    const headerGeneratorType = mapTableQueryToTableViewOptions(tableView.tableQuery)
        .headerGeneratorType;

    switch (headerGeneratorType) {
        case 'RelevanceHybrid':
            headerGenerator.getGroupHeader = getGroupHeaderForSearchTable;
            break;

        case 'Sender':
            headerGenerator.getGroupHeader = getGroupHeaderForSortBySender;
            break;

        case 'Size':
            headerGenerator.getGroupHeader = getGroupHeaderForSortBySize;
            break;

        case 'Importance':
            headerGenerator.getGroupHeader = getGroupHeaderForImportance;
            break;

        case 'Subject':
            // No group headers for subject
            break;

        case 'DateTime':
            if (!getIsBitSet(ListViewBitFlagsMasks.DateHeadersDisabled)) {
                // hide first header only when table supports pinning unless in monarch, where we have a header for pinned.
                headerGenerator.hideFirstHeader = isFeatureEnabled(
                    'mon-tri-monarchPinnedGroupHeader'
                )
                    ? false
                    : shouldTableSortByRenewTime(tableView.tableQuery);
                headerGenerator.getGroupHeader = getGroupHeaderForSortByDateTime;
            }
            break;
        default:
            assertNever(headerGeneratorType);
            break;
    }

    return headerGenerator;
}
