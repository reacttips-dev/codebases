import type ReadingPanePopoutItemFolderInfo from 'owa-popout-utils/lib/schema/ReadingPanePopoutItemFolderInfo';
import { mutatorAction } from 'satcheljs';
import { publicFolderFavoriteStore } from 'owa-public-folder-favorite';
import type { MailFolder } from 'owa-graph-schema';

/**
 * Mutator to add public folder in public folder favorite table for the deeplink view
 */
const loadPopoutDataToPublicFolderFavoriteStore = mutatorAction(
    'loadPopoutDataToPublicFolderFavoriteStore',
    (popoutData: ReadingPanePopoutItemFolderInfo) => {
        const { folderId, mailboxInfo, replicaItem } = popoutData;
        const folderTable = publicFolderFavoriteStore.folderTable;
        if (!folderTable.get(folderId)) {
            const folder = {
                FolderId: { Id: folderId },
                mailboxInfo: mailboxInfo,
                ReplicaList: [replicaItem],
            } as MailFolder;
            folderTable.set(folderId, folder);
        }
    }
);

export default loadPopoutDataToPublicFolderFavoriteStore;
