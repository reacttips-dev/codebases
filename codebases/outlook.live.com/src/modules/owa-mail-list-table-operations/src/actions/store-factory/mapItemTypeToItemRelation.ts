import type { ClientItemId } from 'owa-client-ids';
import type { ItemRow } from 'owa-graph-schema';
import type { TableView } from 'owa-mail-list-store';
import type TableViewItemRelation from 'owa-mail-list-store/lib/store/schema/TableViewItemRelation';
import { getMailboxInfo } from 'owa-mail-mailboxinfo';

//TODO: 22724 itemId should be ClientItemId so we don't need this function to getMailboxInfo
export function getItemClientId(itemId: string, tableView: TableView): ClientItemId {
    return { Id: itemId, mailboxInfo: getMailboxInfo(tableView) };
}

export default function mapItemTypeToItemRelation(
    item: ItemRow,
    tableView: TableView
): TableViewItemRelation {
    return <TableViewItemRelation>{
        executeSearchSortOrder: item.SortOrderSource,
        clientId: getItemClientId(item.ItemId.Id, tableView),
        instanceKey: item.InstanceKey,
    };
}
