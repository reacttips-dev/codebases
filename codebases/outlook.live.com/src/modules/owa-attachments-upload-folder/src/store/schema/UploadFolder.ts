export interface UploadFolder {
    folderName: string;
    folderId: string;
    mailboxId: string;
}

export enum UploadFolderMailboxType {
    User = 'User',
    Group = 'Group',
}
