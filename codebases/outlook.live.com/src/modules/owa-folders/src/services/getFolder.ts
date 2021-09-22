import { getApolloClient } from 'owa-apollo';
import { FolderCountsDocument } from '../graphql/__generated__/FolderCountsQuery.interface';
import { FolderCountsAndPermissionsDocument } from '../graphql/__generated__/FolderCountsAndPermissionsQuery.interface';
import { FolderPermissionsDocument } from '../graphql/__generated__/FolderPermissionsQuery.interface';
import type * as Schema from 'owa-graph-schema';
import { getMailboxInfoForFolderId } from '../util/getMailboxInfoForFolderId';

export type FolderPropertySets = 'Counts' | 'CountsAndPermissions' | 'Permissions';

/**
 * Get the unread and total counts for a folder
 * @param targetFolderId - string - the folder id
 * @param mailboxInfo - mailbox information to generate request options to be sent along with the body
 */
export function getFolderPermissions(
    targetFolderId: string,
    mailboxInfo?: Schema.MailboxInfoInput
): Promise<Schema.MailFolder | null> {
    const mailboxInfoToUse =
        mailboxInfo || getMailboxInfoForFolderId(targetFolderId, true /* routeToAuxIfAuxArchive */);
    return getFolderAdditionalProperties(targetFolderId, 'Permissions', mailboxInfoToUse);
}

/**
 * Service call which gets the content of a folder based on shape and properties specified
 * @param targetFolderId - string - the folder id
 * @param folderProperties - what property sets to fetch
 * @param mailboxInfo - mailbox information to generate request options to be sent along with the body
 */
export async function getFolderAdditionalProperties(
    targetFolderId: string,
    folderProperties: FolderPropertySets,
    mailboxInfo: Schema.MailboxInfoInput
): Promise<Schema.MailFolder | null> {
    const apolloClient = getApolloClient();
    let query;
    switch (folderProperties) {
        case 'Counts':
            query = FolderCountsDocument;
            break;
        case 'CountsAndPermissions':
            query = FolderCountsAndPermissionsDocument;
            break;
        case 'Permissions':
            query = FolderPermissionsDocument;
            break;
    }
    try {
        const folderResponse = await apolloClient.query({
            query,
            variables: {
                id: targetFolderId,
                mailboxInfo: mailboxInfo,
            },
        });
        return folderResponse.data.folder;
    } catch (err) {
        return null;
    }
}
