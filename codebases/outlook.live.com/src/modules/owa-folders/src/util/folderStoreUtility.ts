import { action } from 'satcheljs/lib/legacy';
import type { default as FolderStore, MailboxFolderTreeData } from '../store/schema/FolderStore';
import type { MailFolder } from 'owa-graph-schema';
import type DistinguishedFolderIdName from 'owa-service/lib/contract/DistinguishedFolderIdName';
import { ObservableMap } from 'mobx';
import type FolderId from 'owa-service/lib/contract/FolderId';
import FolderTreeLoadStateEnum from '../store/schema/FolderTreeLoadStateEnum';
import type FolderTreeData from '../store/schema/FolderTreeData';
import {
    ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID,
    PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID,
} from 'owa-folders-constants';
import type * as Schema from 'owa-graph-schema';

export let mockFolderStore: FolderStore = {
    folderTable: new ObservableMap(),
    mailboxFolderTreeData: new ObservableMap(),
};

let folderIdIncrementor = 0;
let folderNameToIdMap: { [key: string]: string };

export function getMockFolderStore() {
    return mockFolderStore;
}
export function getNextFolderId(): FolderId {
    return { Id: 'folderId' + (folderIdIncrementor++).toString(), ChangeKey: 'foo' };
}
export let addFolderToStore = function addFolderToStore(folder: MailFolder, isFavorite?: boolean) {
    mockFolderStore.folderTable.set(folder.FolderId.Id, folder);
    if (folder.ParentFolderId) {
        mockFolderStore.folderTable
            .get(folder.ParentFolderId.Id)
            .childFolderIds.push(folder.FolderId.Id);
    }

    if (folder.DistinguishedFolderId) {
        folderNameToIdMap[folder.DistinguishedFolderId] = folder.FolderId.Id;
    }
};

function addMailboxToStore(folder: MailFolder) {
    const primaryMailbox: FolderTreeData = {
        id: PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID,
        rootFolder: folder,
        loadingState: FolderTreeLoadStateEnum.Uninitialized,
    };
    const archiveMailbox: FolderTreeData = {
        id: ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID,
        rootFolder: null,
        loadingState: FolderTreeLoadStateEnum.Uninitialized,
    };

    // onemailview - this file is used only in test

    const loggedInUserFolderTreeTable = new ObservableMap<string, FolderTreeData>({
        [PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID]: primaryMailbox,
        [ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID]: archiveMailbox,
    });

    mockFolderStore.mailboxFolderTreeData.set('loggedInUser', {
        folderTreeTable: loggedInUserFolderTreeTable,
        sharedFolderUserEmails: [],
    });
}

addFolderToStore = action('addFolderToStore-TestMethod')(addFolderToStore);

export function resetFolderState(): void {
    folderNameToIdMap = {};
    let rootFolder = <MailFolder>{
        DisplayName: 'Root folder',
        FolderClass: 'IPF.Note',
        FolderId: <Schema.FolderId>{
            Id: 'msgfolderroot',
        },
        ParentFolderId: null,
        childFolderIds: [],
        DistinguishedFolderId: 'msgfolderroot',
        UnreadCount: 0,
        TotalCount: 0,
        mailboxInfo: {
            type: 'UserMailbox',
            mailboxSmtpAddress: 'foo@microsoft.com',
            userIdentity: 'foo@microsoft.com',
        },
    };

    let deletedItemsFolder = <MailFolder>{
        DisplayName: 'Deleted items',
        FolderClass: 'IPF.Note',
        FolderId: <Schema.FolderId>{
            Id: 'deleteditems',
        },
        ParentFolderId: rootFolder.FolderId,
        childFolderIds: [],
        DistinguishedFolderId: 'deleteditems',
        UnreadCount: 5,
        TotalCount: 6,
        mailboxInfo: {
            type: 'UserMailbox',
            mailboxSmtpAddress: 'foo@microsoft.com',
            userIdentity: 'foo@microsoft.com',
        },
    };

    let inbox = <MailFolder>{
        DisplayName: 'Inbox',
        FolderClass: 'IPF.Note',
        FolderId: <Schema.FolderId>{ Id: 'inbox' },
        ParentFolderId: rootFolder.FolderId,
        childFolderIds: [],
        DistinguishedFolderId: 'inbox',
        UnreadCount: 3,
        TotalCount: 7,
        mailboxInfo: {
            type: 'UserMailbox',
            mailboxSmtpAddress: 'foo@microsoft.com',
            userIdentity: 'foo@microsoft.com',
        },
    };

    mockFolderStore = {
        folderTable: new ObservableMap<string, MailFolder>(),
        mailboxFolderTreeData: new ObservableMap<string, MailboxFolderTreeData>(),
    };

    addMailboxToStore(rootFolder);
    addFolderToStore(rootFolder);
    addFolderToStore(deletedItemsFolder);
    addFolderToStore(inbox);
}

export function folderNameToId(distinguishedFolderId: DistinguishedFolderIdName): string {
    return folderNameToIdMap[distinguishedFolderId];
}

export function getDistinguishedFolder(
    distinguishedFolderId: DistinguishedFolderIdName
): MailFolder {
    return mockFolderStore.folderTable.get(folderNameToId(distinguishedFolderId));
}

export function createAndAddFolderToStore(displayName: string, parentFolderId: string): string {
    const folderId = getNextFolderId();
    let folder = <MailFolder>{
        FolderId: folderId,
        DisplayName: displayName,
        ParentFolderId: { Id: parentFolderId },
        FolderClass: 'IPF.Note',
        childFolderIds: [],
        mailboxInfo: {
            type: 'UserMailbox',
            mailboxSmtpAddress: 'foo@microsoft.com',
            userIdentity: 'foo@microsoft.com',
        },
    };

    addFolderToStore(folder);

    return folderId.Id;
}
