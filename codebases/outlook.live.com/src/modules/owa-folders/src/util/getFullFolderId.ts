import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import getStore from '../store/store';
import type * as Schema from 'owa-graph-schema';
import { default as createFolderId } from 'owa-service/lib/factory/folderId';

export default function getFullFolderId(folderIdOrName: string): Schema.FolderId {
    let folderId = folderNameToId(folderIdOrName);
    if (!folderId) {
        // This is a non-distinguished folder
        folderId = folderIdOrName;
    }
    if (getStore().folderTable.get(folderId)) {
        return getStore().folderTable.get(folderId).FolderId;
    }

    return createFolderId({
        Id: folderId,
        __type: 'FolderId:#Exchange',
    });
}
