import type TodoFolder from '../schema/TodoFolder';
import { getGuid } from 'owa-guid';

export function createTodoFolder(partialfolder: Partial<TodoFolder>): TodoFolder {
    partialfolder = partialfolder !== null ? partialfolder : {};

    return {
        ...partialfolder,
        Id: partialfolder.Id ? partialfolder.Id : getGuid(),
        Name: partialfolder.Name ? partialfolder.Name : null,
        IsDefaultFolder: partialfolder.IsDefaultFolder ? partialfolder.IsDefaultFolder : false,
        IsSharedFolder: partialfolder.IsSharedFolder ? partialfolder.IsSharedFolder : false,
        IsOwner: partialfolder.IsOwner ? partialfolder.IsOwner : false,
        FolderType: partialfolder.FolderType ? partialfolder.FolderType : 'Other',
        SyncStatus: partialfolder.SyncStatus ? partialfolder.SyncStatus : 'Synced',
        OrderDateTime: partialfolder.OrderDateTime ? partialfolder.OrderDateTime : null,
    };
}
