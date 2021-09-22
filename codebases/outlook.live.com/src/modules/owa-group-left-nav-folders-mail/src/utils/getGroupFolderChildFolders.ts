import { leftNavGroupFoldersStore } from 'owa-group-left-nav-folders-store';
import { GroupFolder } from 'owa-groups-services/lib/groups-rest-apis/schema/GroupFolder';
import { getSelectedGroupId } from 'owa-group-utils';

/**
 * Get child folders of a Group (Inbox) / Group folder.
 */
export function getGroupFolderChildFolders(
    groupId: string,
    folderId?: string
): string[] | undefined {
    const groupSmtp = groupId.toLowerCase();
    const folderHierarchy = leftNavGroupFoldersStore.folderTable.get(groupSmtp)?.folderHierarchy;
    if (folderHierarchy) {
        if (folderId) {
            const folderIds = folderHierarchy.get(folderId)?.ChildFolderIds;
            return folderIds;
        } else {
            for (const groupFolder of folderHierarchy.values()) {
                // Get only the Inbox sub folders
                if (groupFolder.WellKnownName?.toLowerCase() === 'inbox') {
                    const folderIds = [...groupFolder.ChildFolderIds];
                    return folderIds;
                }
            }
        }
    }
    return [];
}

/**
 *
 * @returns List of folders under the Inbox of the current group
 */
export function getContextMenuGroupsFolders(): GroupFolder[] {
    const folderList: GroupFolder[] = [];
    const groupId = getSelectedGroupId();

    // Return all the folderIds of folders under Inbox
    const folderIds = getGroupFolderChildFolders(groupId);

    const groupSmtp = groupId.toLowerCase();
    const folderHierarchy = leftNavGroupFoldersStore.folderTable.get(groupSmtp)?.folderHierarchy;

    if (folderIds && folderHierarchy) {
        folderIds.forEach(element => {
            const folder = folderHierarchy.get(element);
            if (folder) {
                folderList.push(folder);
            }
        });
    }
    return folderList;
}

/**
 *
 * @returns Id of the current Group's Inbox folder
 */
export function getCurrentGroupInboxId(): string {
    let inboxFolderId = '';
    const groupId = getSelectedGroupId();
    const groupSmtp = groupId.toLowerCase();
    const folderHierarchy = leftNavGroupFoldersStore.folderTable.get(groupSmtp)?.folderHierarchy;
    if (folderHierarchy) {
        for (const groupFolder of folderHierarchy.values()) {
            // Get Id of Inbox folder
            if (groupFolder.WellKnownName?.toLowerCase() === 'inbox') {
                inboxFolderId = groupFolder.Id;
            }
        }
    }
    return inboxFolderId;
}
