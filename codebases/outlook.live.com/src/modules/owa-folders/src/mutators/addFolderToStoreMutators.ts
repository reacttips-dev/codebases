import { trace } from 'owa-trace';
import type FolderStore from '../store/schema/FolderStore';
import { addFolderInSortedOrderUnderParentFolder } from '../actions/localFolderOperations';
import getFullFolderId from '../util/getFullFolderId';
import getFolderTable from '../selectors/getFolderTable';
import { mutator } from 'satcheljs';
import { createNewFolderInStore } from '../actions/publicActions';
import type BaseFolderType from 'owa-service/lib/contract/BaseFolderType';
import { mapOWSFolderToGql } from 'owa-folder-gql-mappers';
import type { MailboxInfo } from 'owa-client-ids';

mutator(createNewFolderInStore, actionMessage => {
    addFolderToStore(
        actionMessage.folderStore,
        actionMessage.folder,
        actionMessage.parentFolderId,
        actionMessage.displayName,
        actionMessage.mailboxInfo
    );
});

function addFolderToStore(
    folderStore: FolderStore,
    item: BaseFolderType,
    parentFolderId: string,
    displayName: string,
    mailboxInfo?: MailboxInfo
) {
    const fullParentFolderId = getFullFolderId(parentFolderId);

    const parentFolder = getFolderTable().get(parentFolderId);
    if (!parentFolder) {
        trace.warn('addFolderToStore: parent folder was not found');
    }

    //If notification came from another session, mailbox info would be undefined.
    //TODO: VSO 115265: will add selected mailbox info to payload
    const folder = {
        ...mapOWSFolderToGql(item, mailboxInfo ? mailboxInfo : parentFolder.mailboxInfo),
        ...{
            DisplayName: displayName,
            childFolderIds: [],
        },
    };

    folderStore.folderTable.set(item.FolderId.Id, folder);
    addFolderInSortedOrderUnderParentFolder(folder, folderStore, fullParentFolderId.Id);
}
