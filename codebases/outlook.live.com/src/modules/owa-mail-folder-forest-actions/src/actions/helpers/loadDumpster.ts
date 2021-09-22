import { recoverableItemsFolderName } from './loadDumpster.locstring.json';
import loc from 'owa-localize';
import folderStore from 'owa-folders';
import getFolderData from 'owa-mail-actions/lib/getFolderData';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { mutatorAction } from 'satcheljs';
import type { MailFolder, FolderId } from 'owa-graph-schema';
import type { MailboxInfo } from 'owa-client-ids';

/**
 * Add dumpster to folder table
 * @param dumpsterFolderIdName - Distinguished folder name
 * @param mailboxInfo - MailboxInfo
 */
export function loadDumpster(dumpsterFolderIdName: string, mailboxInfo: MailboxInfo) {
    const dumpsterFolderId = folderNameToId(dumpsterFolderIdName);
    const isDumpsterInFolderTable = folderStore.folderTable.has(dumpsterFolderId);

    if (dumpsterFolderId && !isDumpsterInFolderTable) {
        const dumpsterFolder = <MailFolder>{
            UnreadCount: 0,
            TotalCount: -1, // Set as -1 so that we show spinner in the UI until we get real count from server
            FolderId: <FolderId>{ Id: dumpsterFolderId },
            DistinguishedFolderId: dumpsterFolderIdName,
            DisplayName: loc(recoverableItemsFolderName),
            FolderClass: 'IPM.Note',
            mailboxInfo: mailboxInfo,
        };

        addDumpsterFolderToStore(dumpsterFolderId, dumpsterFolder);
        getFolderData(dumpsterFolderId);
    }
}

const addDumpsterFolderToStore = mutatorAction(
    'addDumpsterFolderToStore',
    (id: string, folder: MailFolder) => {
        folderStore.folderTable.set(id, folder);
    }
);
