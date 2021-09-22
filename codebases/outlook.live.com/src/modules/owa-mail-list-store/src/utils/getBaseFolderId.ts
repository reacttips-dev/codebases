import TableQuery, { TableQueryType } from '../store/schema/TableQuery';
import type TableView from '../store/schema/TableView';
import type BaseFolderId from 'owa-service/lib/contract/BaseFolderId';
import distinguishedFolderId from 'owa-service/lib/factory/distinguishedFolderId';
import folderId from 'owa-service/lib/factory/folderId';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * @param tableView for which we want to get the server base folder id
 * @param returnNullIfSameAsFolderId TRUE will return null when serverFolderId and folderId are the same, FALSE returns the
 * baseFolderId of folderId.
 * @return Returns the BaseFolderId for the table view
 * @note client has code that default serverFolderId (which stores searchFolderId returned by server) to folderId,
 * and so serverFolderId may end up being identical as folderId. In the case that they're equal,
 * caller may want to treat it as if serverFolderId is not available.
 */
export function getBaseServerFolderId(
    tableView: TableView,
    returnNullIfSameAsFolderId?: boolean
): BaseFolderId | null {
    if (!tableView.serverFolderId) {
        return null;
    }

    // For MarkAllAsRead on left nav, the group might not have been loaded yet so we don't have a real serverFolderId set.
    // In that case we need to use the DistinguishedFolderId instead.
    if (tableView.serverFolderId == tableView.tableQuery.folderId) {
        if (returnNullIfSameAsFolderId) {
            return null;
        }

        return getBaseFolderId(tableView.tableQuery);
    }

    return getFolderId(tableView.serverFolderId);
}

/**
 * @param tableQuery for which we want to get the base folder id
 * @return Returns BaseFolderId for the tableQuery
 */
export default function getBaseFolderId(tableQuery: TableQuery): BaseFolderId {
    return tableQuery.type == TableQueryType.Group
        ? getBaseFolderIdForGroup(tableQuery.folderId)
        : getFolderId(tableQuery.folderId);
}

function getBaseFolderIdForGroup(groupId: string): BaseFolderId {
    return distinguishedFolderId({
        Id: !isFeatureEnabled('grp-junkemailitems') ? 'inbox' : 'junkemail',
        Mailbox: {
            MailboxType: 'GroupMailbox',
            EmailAddress: groupId,
        },
    });
}

function getFolderId(folderIdString: string): BaseFolderId {
    return folderId({ Id: folderIdString });
}
