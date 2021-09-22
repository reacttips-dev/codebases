import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { getFolderTable, isPublicFolder } from 'owa-folders';
import type { MailFolder } from 'owa-graph-schema';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import getFolderViewStateFromId from '../selectors/getFolderViewStateFromId';
import { SortColumn } from 'owa-mail-list-store';

const MESSAGE_VIEW_ONLY_FOLDER_NAMES = ['drafts', 'junkemail', 'recoverableitemsdeletions'];

/**
 * Get the list view type for the folder
 * @param folderId the folder id
 */
export default function getListViewTypeForFolder(folderId: string): ReactListViewType {
    // Returns message view if the folder is default to message view, if
    // folder is or under archive mailbox or shared folders, or if
    // folder is a public folder
    let folder;
    if (folderId) {
        folder = getFolderTable().get(folderId);
    }

    return getListViewTypeForFolderV2(folder);
}

/**
 * Returns the list view type to use depending on the folder
 * @param folder
 */
export function getListViewTypeForFolderV2(folder: MailFolder): ReactListViewType {
    // Check if folder is undefined : happens during the initial boot, when the folder table has not been populated
    if (
        (folder &&
            ((folder.DistinguishedFolderId &&
                MESSAGE_VIEW_ONLY_FOLDER_NAMES.indexOf(folder.DistinguishedFolderId) != -1) ||
                folder.mailboxInfo.type === 'ArchiveMailbox' ||
                folder.mailboxInfo.type === 'SharedMailbox')) ||
        isPublicFolder(folder?.FolderId.Id)
    ) {
        return ReactListViewType.Message;
    }

    // Return the GlobalListViewTypeReact in user options
    // For backward compatibility, return conversation view for users on utah version less than 15.20.0059.000
    // Because users don't have GlobalListViewTypeReact in the UserOptions
    const globalListViewTypeReact = getUserConfiguration()?.UserOptions?.GlobalListViewTypeReact;

    // For Monarch, all sorts other than Date will show an item list instead of a conversation list
    if (
        folder &&
        globalListViewTypeReact == ReactListViewType.Conversation &&
        isHostAppFeatureEnabled('nativeResolvers') &&
        isFeatureEnabled('mon-conv-useHxForConvListViewSort')
    ) {
        const viewState = getFolderViewStateFromId(folder.FolderId.Id);
        if (viewState && viewState.sortColumn != SortColumn.Date) {
            return ReactListViewType.Message;
        }
    }

    return globalListViewTypeReact || ReactListViewType.Conversation;
}
