import publicFolderTable, { PublicFolder } from '../store/publicFolderTable';

export default function getPublicFolderFromFolderId(folderId: string): PublicFolder {
    const folder: PublicFolder = publicFolderTable.folderTable.get(folderId);
    return folder;
}
