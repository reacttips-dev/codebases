import { createStore } from 'satcheljs';

export interface PublicFolderPickerState {
    showPanel: boolean; // to show/hide the picker.
    selectedFolderId: string; // folderId of the currently selected folder.
    showErrorDialog: boolean; // to show a dialog box instead of picker, in case there is no public folder deployment.
}

export default createStore<PublicFolderPickerState>('publicFolderPickerStore', {
    showPanel: false,
    selectedFolderId: null,
    showErrorDialog: false,
})();
