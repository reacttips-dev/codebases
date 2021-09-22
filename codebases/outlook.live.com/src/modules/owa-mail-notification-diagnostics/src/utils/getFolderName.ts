import folderStore from 'owa-folders';

export default function getFolderName(folderId: string): string {
    let folderName = '';
    if (folderId) {
        const folder = folderStore.folderTable.get(folderId);
        if (folder) {
            folderName = folder.DisplayName;
        }
    }

    return folderName;
}
