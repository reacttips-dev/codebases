import { action } from 'satcheljs';
import type * as Schema from 'owa-graph-schema';

/**
 * Action to fetch archive recoverable items (dumpster) folder
 */
export const fetchArchiveDumpsterFolder = action('FETCH_ARCHIVE_DUMPSTER_FOLDER');

export const setReplicaList = action(
    'SET_REPLICA_LIST',
    (folderId: string, replicaList: string[]) => {
        return {
            folderId,
            replicaList,
        };
    }
);

export const onFindDumpsterFolderSuccess = action(
    'ON_FIND_DUMPSTER_FOLDER_SUCCESS',
    (
        rootFolder: Schema.MailFolder,
        folders: Schema.MailFolder[],
        principalSMTPAddress: string
    ) => ({ rootFolder, folders, principalSMTPAddress })
);
