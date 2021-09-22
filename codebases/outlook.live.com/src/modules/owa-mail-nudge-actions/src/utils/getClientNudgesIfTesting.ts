import { MailRowDataPropertyGetter, TableView } from 'owa-mail-list-store';
import { NudgedReason, NudgedRow } from 'owa-mail-nudge-store';
import { getQueryStringParameter } from 'owa-querystring';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';

/*
 * This function checks for &testNudge=1 in url to add client test nudges.
 * It marks the first and the tenth item in the table as nudged,
 * so that we can test client UI and functionality when no nudges is available
 * from server.
 */
export default function getClientNudgesIfTesting(tableView: TableView): NudgedRow[] {
    const testNudgeURIString = getQueryStringParameter('testNudge');
    const testNudgeString = decodeURIComponent(testNudgeURIString || '').trim();

    // Return empty array if query param isn't present
    if (testNudgeString.length == 0) {
        return [];
    }

    const testNudges = [];

    if (tableView.rowKeys.length > 0) {
        // Add a nudge
        const nudgeReason =
            tableView.tableQuery.folderId === folderNameToId('sentitems')
                ? NudgedReason.SentDaysAgo
                : NudgedReason.ReceivedDaysAgo;
        const nudgedRow1 = {
            rowKey: tableView.rowKeys[4],
            itemId: MailRowDataPropertyGetter.getItemIds(tableView.rowKeys[0], tableView)[0],
            conversationId: MailRowDataPropertyGetter.getConversationId(
                tableView.rowKeys[4],
                tableView
            ),
            tableViewId: tableView.id,
            reason: nudgeReason,
            daysAgo: 1,
        };
        testNudges.push(nudgedRow1);

        // Add a 0-day nudge
        if (tableView.rowKeys.length > 3) {
            const zeroDayNudge = {
                rowKey: tableView.rowKeys[6],
                itemId: MailRowDataPropertyGetter.getItemIds(tableView.rowKeys[3], tableView)[0],
                conversationId: MailRowDataPropertyGetter.getConversationId(
                    tableView.rowKeys[6],
                    tableView
                ),
                tableViewId: tableView.id,
                reason: nudgeReason,
                daysAgo: 0,
            };
            testNudges.push(zeroDayNudge);
        }

        // Add another nudge 50% of the time
        if (tableView.rowKeys.length > 10 && Math.floor(Math.random() * 2) === 1) {
            const nudgedRow2 = {
                rowKey: tableView.rowKeys[10],
                itemId: MailRowDataPropertyGetter.getItemIds(tableView.rowKeys[10], tableView)[0],
                conversationId: MailRowDataPropertyGetter.getConversationId(
                    tableView.rowKeys[10],
                    tableView
                ),
                tableViewId: tableView.id,
                reason: nudgeReason,
                daysAgo: 3,
            };
            testNudges.push(nudgedRow2);
        }
    }

    return testNudges;
}
