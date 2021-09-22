import { folderStore } from '../store/store';
import type { MailFolder } from 'owa-graph-schema';
import isFolderOrSubFolderOfDistinguishedFolder, {
    FolderTableState,
    isUnderDistinguishedFolder,
} from './isFolderOrSubFolderOfDistinguishedFolder';

export default function isFolderUnderMsg(
    folder: MailFolder,
    state: FolderTableState = { folderTable: folderStore.folderTable }
): boolean {
    return isUnderDistinguishedFolder(folder, 'msgfolderroot', state);
}

/**
 * @param folderId - Id of folder for which we are checking
 * @returns boolean - true if folder is primary root or a subfolder of primary root
 */
export function isFolderOrSubFolderOfMsgRoot(folderId: string): boolean {
    return isFolderOrSubFolderOfDistinguishedFolder(
        folderStore.folderTable.get(folderId),
        'msgfolderroot'
    );
}
