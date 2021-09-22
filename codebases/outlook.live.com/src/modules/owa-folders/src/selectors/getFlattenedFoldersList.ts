import getFolderTable from './getFolderTable';
import { hasDisplayableChildFolders } from './hasDisplayableChildFolders';
import type { MailFolder } from 'owa-graph-schema';

export interface FlattenedFolder extends MailFolder {
    depth: number;
}

/**
 * Gets a list of folders with a depth property
 * @param rootFolderIds folderIds to start traversing to create the flattened folder list
 * @param includeChildFolders function to determine if a folders children should be included in the list
 */
export function getFlattenedFoldersList(
    rootFolderIds: string[],
    includeChildFolders: (folderId: string) => boolean
): FlattenedFolder[] {
    const folderViewNodes = getFlattenedFoldersListHelper(rootFolderIds, 0, includeChildFolders);
    return folderViewNodes;
}

function getFlattenedFoldersListHelper(
    folderIds: string[],
    nestDepth: number,
    includeChildFolders: (folderId: string) => boolean
): FlattenedFolder[] {
    const folders: FlattenedFolder[] = [];
    if (nestDepth === 0) {
        const renderedChildNodes = getFlattenedFoldersListHelper(
            folderIds,
            nestDepth + 1,
            includeChildFolders
        );
        folders.push(...renderedChildNodes);
    } else {
        folderIds.forEach(folderId => {
            const folder = getFolderTable().get(folderId);
            if (folder) {
                folders.push({ ...folder, depth: nestDepth });

                if (hasDisplayableChildFolders(folderId) && includeChildFolders(folderId)) {
                    const renderedChildNodes = getFlattenedFoldersListHelper(
                        folder.childFolderIds,
                        nestDepth + 1,
                        includeChildFolders
                    );
                    folders.push(...renderedChildNodes);
                }
            }
        });
    }
    return folders;
}
