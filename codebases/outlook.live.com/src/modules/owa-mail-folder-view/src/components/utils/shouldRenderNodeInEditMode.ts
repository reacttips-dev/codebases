import type { FolderTextFieldOperation } from 'owa-mail-folder-store/lib/store/schema/FolderTextFieldViewState';
import { default as viewStateStore } from 'owa-mail-folder-store/lib/store/store';
import {
    ARCHIVE_FOLDERS_TREE_TYPE,
    SHARED_FOLDERS_TREE_TYPE,
    PRIMARY_FOLDERS_TREE_TYPE,
} from 'owa-folders-constants';

export function shouldRenderNodeInEditMode(
    folderId: string,
    operation: FolderTextFieldOperation,
    mailboxSmtpAddress: string
): boolean {
    const folderTextFieldViewState = viewStateStore.folderTextFieldViewState;
    return (
        folderTextFieldViewState &&
        folderTextFieldViewState.folderId == folderId &&
        folderTextFieldViewState.operation === operation &&
        folderTextFieldViewState.mailboxSmtpAddress === mailboxSmtpAddress &&
        (folderTextFieldViewState.folderNodeType === PRIMARY_FOLDERS_TREE_TYPE ||
            folderTextFieldViewState.folderNodeType === ARCHIVE_FOLDERS_TREE_TYPE ||
            folderTextFieldViewState.folderNodeType === SHARED_FOLDERS_TREE_TYPE)
    );
}
