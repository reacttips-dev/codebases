import folderStore from 'owa-folders';
import type { ObservableMap } from 'mobx';
import type { MailFolder, FolderForestTreeType } from 'owa-graph-schema';
import type { FolderTextFieldOperation } from '../store/schema/FolderTextFieldViewState';
import { action as deprecatedAction } from 'satcheljs/lib/legacy';
import { action } from 'satcheljs';
import viewStateStore from '../store/store';
import type FolderTreeViewStateStore from '../store/schema/FolderTreeViewStateStore';
import setFolderViewExpansionState from '../actions/setFolderViewExpansionState';

export interface FolderStoresState {
    folderTable: ObservableMap<string, MailFolder>;
    viewState: FolderTreeViewStateStore;
}

export let initiateMailFolderTextField = deprecatedAction('initiateMailFolderTextField')(
    function initiateMailFolderTextField(
        folderId: string,
        operation: FolderTextFieldOperation,
        folderNodeType: FolderForestTreeType,
        mailboxSmtpAddress: string,
        state: FolderStoresState = {
            folderTable: folderStore.folderTable,
            viewState: viewStateStore,
        }
    ): void {
        if (operation === 'new') {
            setFolderViewExpansionState(folderId, true);
        }
        state.viewState.folderTextFieldViewState = {
            folderId,
            operation,
            folderNodeType,
            mailboxSmtpAddress,
        };
    }
);

export let dismissMailFolderTextField = action('dismissMailFolderTextField');
