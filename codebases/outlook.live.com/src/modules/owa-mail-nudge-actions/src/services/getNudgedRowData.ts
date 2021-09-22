import type { ClientItemId } from 'owa-client-ids';
import { getMailboxInfoFromTableQuery } from 'owa-mail-mailboxinfo';
import { lazygetConversationRowById } from 'owa-mail-find-rows';
import { lazyLoadItem } from 'owa-mail-store-actions';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { trace } from 'owa-trace';
import type { MailListRowDataType, TableView, MailFolderTableQuery } from 'owa-mail-list-store';
import { shouldTableSortByRenewTime } from 'owa-mail-list-response-processor';
import type { ItemRow } from 'owa-graph-schema';

export default async function getNudgedRowData(
    rowId: string,
    tableView: TableView
): Promise<MailListRowDataType> {
    const tableQuery = tableView.tableQuery;
    if (tableQuery.listViewType === ReactListViewType.Message) {
        const clientItemId: ClientItemId = {
            Id: rowId,
            mailboxInfo: getMailboxInfoFromTableQuery(tableQuery),
        };

        const item = await lazyLoadItem.importAndExecute(clientItemId, 'LoadNudgedItem');

        return item as ItemRow;
    }

    return loadNudgedConversation(rowId, tableView);
}

async function loadNudgedConversation(
    conversationIdString: string,
    tableView: TableView
): Promise<MailListRowDataType> {
    const mailTableQuery = tableView.tableQuery as MailFolderTableQuery;
    const mailboxInfo = getMailboxInfoFromTableQuery(mailTableQuery);

    return lazygetConversationRowById
        .importAndExecute(
            conversationIdString,
            mailTableQuery.folderId,
            mailTableQuery.sortBy,
            shouldTableSortByRenewTime(mailTableQuery),
            mailTableQuery.requestShapeName,
            mailboxInfo
        )
        .then(conversation => {
            return conversation;
        })
        .catch(error => {
            trace.warn('loadNudgedConversation throws an exception' + error.message);
            return null;
        });
}
