import getAllTableViewsContainingItemsForFolder from './getAllTableViewsContainingItemsForFolder';
import getAllTableViewsContainingItemsForGroup from './getAllTableViewsContainingItemsForGroup';
import type { MailboxInfo } from 'owa-client-ids';
import type { TableView } from 'owa-mail-list-store';

/**
 * Get all the table views that may contain items given the information passed in
 * @param mailboxInfo the mailbox info of the item
 * @param parentFolderId the parent folder id for the item
 * @param shouldIncludeSearchTable - whether to include the search table in the table list being returned
 */
export default function getAllTableViewsContainingItems(
    mailboxInfo: MailboxInfo,
    parentFolderId: string,
    shouldIncludeSearchTable: boolean
): TableView[] {
    let tableViews: TableView[] = [];
    if (mailboxInfo && mailboxInfo.type == 'GroupMailbox') {
        tableViews = getAllTableViewsContainingItemsForGroup(
            mailboxInfo.mailboxSmtpAddress,
            shouldIncludeSearchTable
        );
    } else {
        tableViews = getAllTableViewsContainingItemsForFolder(
            parentFolderId,
            shouldIncludeSearchTable
        );
    }

    return tableViews;
}
