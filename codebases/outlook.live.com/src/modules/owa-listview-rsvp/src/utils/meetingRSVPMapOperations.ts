import { getMailboxInfoFromTableQuery } from 'owa-mail-mailboxinfo';
import type { TableView } from 'owa-mail-list-store';

/* List to store the item ids to get the RSVP information */
const meetingItemIdMap: IdMap = {}; // Map<mailboxId, ItemId[]>

export interface IdMap {
    [mailboxId: string]: RowInfoToGetRSVP[];
}

// A RowInfo that contains conversationId and itemId for items to get RSVP
// The ItemId will be used to be fetched and the conversationId will be used as a way
// to revert the conversation state in case  ConversationView is used on the ListView
export interface RowInfoToGetRSVP {
    rowKey: string;
    itemId: string;
    tableViewId: string;
}

/**
 * Add an item id (with its conversationId) to the meeting id map
 * @param tableView the tableView
 * @param instanceKey the instance key (can be from the item or conversation)
 * @param itemId the item id
 */
export let add = function addToMeetingItemIdMap(
    tableView: TableView,
    rowKey: string,
    itemId: string
) {
    const mailboxSmtpAddress = getMailboxInfoFromTableQuery(tableView.tableQuery)
        .mailboxSmtpAddress;
    if (contains(mailboxSmtpAddress, itemId)) {
        return;
    }

    const existInTheMap = meetingItemIdMap[mailboxSmtpAddress];
    if (existInTheMap) {
        meetingItemIdMap[mailboxSmtpAddress].push({
            rowKey: rowKey,
            itemId: itemId,
            tableViewId: tableView.id,
        });
    } else {
        meetingItemIdMap[mailboxSmtpAddress] = [
            { rowKey: rowKey, itemId: itemId, tableViewId: tableView.id },
        ];
    }
};

/**
 * Whether an item is already added to the fetch list of the mailbox
 * @param mailboxSmtpAddress the mailbox smtp address
 * @param itemId the item id to be fetched
 * @returns true if an item is already added to the fetch list, false otherwise
 */
export let contains = function containsInMeetingItemIdMap(
    mailboxSmtpAddress: string,
    itemId: string
): boolean {
    const rowInfos = meetingItemIdMap[mailboxSmtpAddress];
    return rowInfos && rowInfos.some(rowInfo => rowInfo.itemId === itemId);
};

/**
 * Remove the meeting fetch list of the specified user mailbox
 * @param mailboxSmtpAddress the mailboxsmtp address
 * */
export let removeFromFetchList = function removeFetchListForMailbox(mailboxSmtpAddress: string) {
    delete meetingItemIdMap[mailboxSmtpAddress];
};

/**
 * Get the meeting fetch list of the specified user mailbox
 * @param mailboxSmtpAddress the mailbox smtp address
 * @return an array of RowInfo (item ids that to be fetched and their conversation id) for meeting information
 */
export let getFetchList = function getFetchListForMailbox(
    mailboxSmtpAddress: string
): RowInfoToGetRSVP[] {
    return meetingItemIdMap[mailboxSmtpAddress];
};
