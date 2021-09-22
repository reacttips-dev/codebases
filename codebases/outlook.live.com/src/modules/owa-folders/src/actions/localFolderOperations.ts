import type { MailboxInfo } from 'owa-client-ids';
import { isFeatureEnabled } from 'owa-feature-flags';
import { PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID } from 'owa-folders-constants';
import type { MailFolder } from 'owa-graph-schema';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { action } from 'satcheljs/lib/legacy';
import { getEffectiveFolderDisplayName } from '../index';
import getFolderTable from '../selectors/getFolderTable';
import getPrimaryFolderTreeRootFolder from '../selectors/getPrimaryFolderTreeRootFolder';
import type FolderStore from '../store/schema/FolderStore';
import { folderStore } from '../store/store';

export const deleteFoldersFromFolderTable = action('removeFolderFromParentFolder')(
    function deleteFoldersFromFolderTable(
        folderIdsToDelete: string[],
        mockFolderStore?: FolderStore
    ) {
        // delete each folder from local store
        const folderTable = mockFolderStore?.folderTable || getFolderTable();
        folderIdsToDelete.forEach(folderId => {
            folderTable.delete(folderId);
        });
    }
);

export let removeFolderFromParentFolder = action('removeFolderFromParentFolder')(
    function removeFolderFromParentFolder(
        folderToMove: MailFolder | undefined,
        mockFolderStore?: FolderStore
    ) {
        const folderTable = mockFolderStore?.folderTable || getFolderTable();
        if (!folderToMove?.ParentFolderId) {
            return;
        }

        let parentFolder = folderTable.get(folderToMove.ParentFolderId.Id);

        // When multi-accounts experience is enabled and user has multi-accounts, there are multi-
        // root folder copies in the mailboxFolderTreeData, but only one was added to folderTable,
        // because they all have same distingish id: PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID. So
        // folderTable.get(id) probably won't get the correct root folder copy, at this time we
        // should use getPrimaryFolderTreeRootFolder(email) to retrieve it from mailboxFolderTreeData.
        if (
            isFeatureEnabled('nh-boot-acctmonaccounts') &&
            isHostAppFeatureEnabled('acctmonaccounts') &&
            isFeatureEnabled('acct-multiaccounts-folderlists') &&
            parentFolder.DistinguishedFolderId === PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID
        ) {
            parentFolder = getPrimaryFolderTreeRootFolder(
                folderToMove.mailboxInfo.mailboxSmtpAddress
            );
        }

        let childFolderIds = parentFolder.childFolderIds;
        const folderIdIndex = childFolderIds.indexOf(folderToMove.FolderId.Id);
        if (folderIdIndex > -1) {
            childFolderIds.splice(folderIdIndex, 1);
        }
    }
);

export function addFolderInSortedOrderUnderParentFolder(
    folder: MailFolder,
    store: FolderStore,
    parentFolderId: string
): void {
    // Try to insert the folder in the alphabetically most optimal place.
    // The server will do some better alphabetical server-side sorting, but this
    // is good enough and it covers 90% of the languages and cases.
    let parentFolder = store.folderTable.get(parentFolderId);

    // When multi-accounts experience is enabled and user has multi-accounts, there are multi-
    // root folder copies in the mailboxFolderTreeData, but only one was added to folderTable,
    // because they all have same distingish id: PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID. So
    // folderTable.get(id) probably won't get the correct root folder copy, at this time we
    // should use getPrimaryFolderTreeRootFolder(email) to retrieve it from mailboxFolderTreeData.
    if (
        isFeatureEnabled('nh-boot-acctmonaccounts') &&
        isHostAppFeatureEnabled('acctmonaccounts') &&
        isFeatureEnabled('acct-multiaccounts-folderlists') &&
        parentFolder.DistinguishedFolderId === PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID
    ) {
        parentFolder = getPrimaryFolderTreeRootFolder(folder.mailboxInfo.mailboxSmtpAddress);
    }

    let childFolderIds: string[] = parentFolder.childFolderIds;
    let added: boolean = false;
    let displayNameLowerCase = getEffectiveFolderDisplayName(folder).toLowerCase();

    // Add folder if its not already added
    if (childFolderIds.indexOf(folder.FolderId.Id) == -1) {
        for (let i = 0; i < childFolderIds.length && !added; i++) {
            let childFolder = store.folderTable.get(childFolderIds[i]);

            // Insert item in position i, if it is next in alphabetical order.
            if (getEffectiveFolderDisplayName(childFolder).toLowerCase() > displayNameLowerCase) {
                childFolderIds.splice(i, 0, folder.FolderId.Id);
                added = true;
            }
        }

        // Append at the end if needed.
        if (!added) {
            childFolderIds.push(folder.FolderId.Id);
        }
    }
}

export let moveFolderToParentFolder = action('moveFolderToParentFolder')(
    function moveFolderToParentFolder(
        folderToMoveId: string,
        destinationFolderId: string,
        destinationFolderMailboxInfo: MailboxInfo,
        mockFolderStore?: FolderStore // for unit testing
    ) {
        const folderTable = mockFolderStore?.folderTable || getFolderTable();
        const folderToMove = folderTable.get(folderToMoveId);
        removeFolderFromParentFolder(folderToMove, mockFolderStore);
        addFolderInSortedOrderUnderParentFolder(
            folderToMove,
            mockFolderStore || folderStore,
            destinationFolderId
        );
        folderToMove.ParentFolderId = { Id: destinationFolderId, __typename: 'FolderId' };
        folderToMove.mailboxInfo = destinationFolderMailboxInfo;
    }
);
