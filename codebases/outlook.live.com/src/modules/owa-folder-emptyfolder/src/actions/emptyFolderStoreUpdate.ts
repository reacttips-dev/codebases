import { action } from 'satcheljs';
import type { OwaDate } from 'owa-datetime';
import type { DisposalType } from 'owa-graph-schema';

export default action(
    'EMPTY_FOLDER_STORE_UPDATE',
    (
        folderId: string,
        clientLastSyncTime: OwaDate | null,
        deletedItemsFolderId: string,
        disposalType: DisposalType,
        deleteSubFolders: boolean,
        rowKeysToExclude?: string[]
    ) => ({
        folderId,
        clientLastSyncTime,
        deletedItemsFolderId,
        disposalType,
        deleteSubFolders,
        rowKeysToExclude,
    })
);
