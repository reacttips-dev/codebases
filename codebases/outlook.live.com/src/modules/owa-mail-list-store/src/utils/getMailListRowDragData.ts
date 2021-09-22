import * as MailRowDataPropertyGetter from '../selectors/mailRowDataPropertyGetter';
import { DraggableItemTypes } from 'owa-dnd/lib/utils/DraggableItemTypes';
import loc from 'owa-localize';
import { noSubject } from 'owa-locstrings/lib/strings/nosubject.locstring.json';
import getSelectedTableView from './getSelectedTableView';
import type { MailListRowDragData } from 'owa-mail-types/lib/types/MailListRowDragData';
import isConversationView from './isConversationView';

export default function getMailListRowDragData(): MailListRowDragData {
    // Also rename this to getMailListRowDragData. May be get this information from the mailRowData getter api
    const tableView = getSelectedTableView();
    const latestItemIds = [];
    const subjects = [];
    const sizes = [];
    const selectedRowKeys = [...tableView.selectedRowKeys.keys()];
    const itemType =
        selectedRowKeys.length > 1
            ? isConversationView(tableView)
                ? DraggableItemTypes.MultiMailListConversationRows
                : DraggableItemTypes.MultiMailListMessageRows
            : DraggableItemTypes.MailListRow;

    selectedRowKeys.forEach(rowKey => {
        const subject = MailRowDataPropertyGetter.getSubject(rowKey, tableView);
        subjects.push(subject ? subject : loc(noSubject));

        const size = MailRowDataPropertyGetter.getSize(rowKey, tableView);
        sizes.push(size ? size : 0);

        const itemIds = MailRowDataPropertyGetter.getItemIds(rowKey, tableView);
        if (itemIds) {
            latestItemIds.push(itemIds[0]);
        }
    });

    return {
        itemType: itemType,
        tableViewId: tableView.id,
        tableListViewType: tableView.tableQuery.listViewType,
        rowKeys: selectedRowKeys,
        subjects: subjects,
        latestItemIds: latestItemIds,
        sizes: sizes,
    };
}
