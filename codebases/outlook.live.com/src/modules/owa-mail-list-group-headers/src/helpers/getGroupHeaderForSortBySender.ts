import { unknownSenderOrRecipient } from 'owa-locstrings/lib/strings/unknownsenderorrecipient.locstring.json';
import loc from 'owa-localize';
import { GroupHeader, SenderGroupHeaderId, GroupHeaderId } from 'owa-mail-group-headers';
import { TableView, MailRowDataPropertyGetter } from 'owa-mail-list-store';

/**
 * Get GroupHeader for row
 * @param rowKey rowKey for which we want to lookup time group header
 * @param tableView tableView
 * @return group header for this row
 */
export default function getGroupHeaderForSortBySender(
    rowKey: string,
    tableView: TableView
): GroupHeader {
    const uniqueSenders = MailRowDataPropertyGetter.getUniqueSenders(rowKey, tableView);
    let uniqueSenderHeaderText = loc(unknownSenderOrRecipient);
    let uniqueSenderHeaderId: GroupHeaderId = SenderGroupHeaderId.Unknown;

    if (uniqueSenders && uniqueSenders.length > 0) {
        uniqueSenderHeaderText = uniqueSenders[0];
        uniqueSenderHeaderId = uniqueSenders[0];
    }

    return {
        headerText: () => uniqueSenderHeaderText,
        headerId: uniqueSenderHeaderId,
    };
}
