import { topResults, allResults } from '../strings.locstring.json';
import loc from 'owa-localize';
import type { GroupHeader } from 'owa-mail-group-headers';
import { MailRowDataPropertyGetter, TableView } from 'owa-mail-list-store';

/**
 * Get GroupHeader for row in search table
 * @param rowKey rowKey for which we want to lookup time group range
 * @param tableView tableView
 * @return group header for this row
 */
export default function getGroupHeaderForSearchTable(
    rowKey: string,
    tableView: TableView
): GroupHeader {
    const sortOrder = MailRowDataPropertyGetter.getExecuteSearchSortOrder(rowKey, tableView);
    const currentHeaderText =
        <any>sortOrder == 1 || sortOrder === 'Relevance' ? loc(topResults) : loc(allResults);

    return {
        headerText: () => currentHeaderText,
        headerId: currentHeaderText,
    };
}
