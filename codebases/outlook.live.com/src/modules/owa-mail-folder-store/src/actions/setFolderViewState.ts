import { default as viewStateStore } from '../store/store';
import { mutatorAction } from 'satcheljs';
import type MailFolderNodeViewState from '../store/schema/MailFolderNodeViewState';

/*
 * Sets folder node view state
 * @param folderId the folder whose view state we are updating
 * @param folderViewState the view state to set
 */
export default mutatorAction(
    'setFolderViewState',
    function setFolderViewState(folderId: string, folderViewState: MailFolderNodeViewState): void {
        viewStateStore.folderNodeViewStates.set(folderId, folderViewState);
    }
);
