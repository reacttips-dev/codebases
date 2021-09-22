import { highImportanceMenuText } from 'owa-locstrings/lib/strings/highimportancemenutext.locstring.json';
import { normalImportanceMenuText } from 'owa-locstrings/lib/strings/normalimportancemenutext.locstring.json';
import { lowImportanceMenuText } from 'owa-locstrings/lib/strings/lowimportancemenutext.locstring.json';
import loc from 'owa-localize';
import type { GroupHeader } from 'owa-mail-group-headers';
import { MailRowDataPropertyGetter, TableView } from 'owa-mail-list-store';

/**
 * Get GroupHeader for row
 * @param rowKey item key for which we want to lookup importance group range
 * @param tableView tableView
 * @return group header for this row
 */
export default function getGroupHeaderForSortByDateTime(
    rowKey: string,
    tableView: TableView
): GroupHeader {
    const importance = MailRowDataPropertyGetter.getImportance(rowKey, tableView);
    let headerText;
    switch (importance) {
        case 'Low':
            headerText = loc(lowImportanceMenuText);
            break;
        case 'Normal':
            headerText = loc(normalImportanceMenuText);
            break;
        case 'High':
            headerText = loc(highImportanceMenuText);
            break;
        default:
            throw new Error(
                'Cannot create importance group header for an importance type that does not exist!'
            );
    }

    return {
        headerText: () => headerText,
        headerId: importance,
    };
}
