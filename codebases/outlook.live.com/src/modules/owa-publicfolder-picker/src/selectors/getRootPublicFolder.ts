import publicFolderTable, { PublicFolder } from '../store/publicFolderTable';

export default function getRootPublicFolder(): PublicFolder {
    const rootfolder: PublicFolder = publicFolderTable.rootFolder;
    return rootfolder;
}
