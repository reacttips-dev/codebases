import getFolderTable from './getFolderTable';

export function hasDisplayableChildFolders(folderId: string): boolean {
    const folder = getFolderTable().get(folderId);

    if (!folder.childFolderIds) {
        return false;
    }

    const visibleFolders = folder.childFolderIds.map((childFolderId: string) => {
        const childFolder = getFolderTable().get(childFolderId);
        return !!childFolder;
    });

    return visibleFolders.length > 0;
}
