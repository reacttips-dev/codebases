import { action } from 'satcheljs';

/**
 * Action to remove folder tree data.
 */
export const removeFolderTreeData = action(
    'REMOVE_FOLDERTREE_DATA',
    (folderTreeId: string, userIdentity?: string) => ({
        folderTreeId,
        userIdentity,
    })
);
