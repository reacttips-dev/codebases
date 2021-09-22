import { mutator } from 'satcheljs';
import publicFolderPickerStore from '../store/publicFolderPickerStore';
import publicFolderPickerHeaderStore from '../store/publicFolderPickerHeaderStore';
import {
    publicFolderPickerController,
    shouldShowPublicFolderErrorDialog,
    updateResponseMessageInPicker,
    selectPublicFolderNode,
} from '../actions/updatePublicFolderPickerProps';

mutator(publicFolderPickerController, actionMessage => {
    const showPanel: boolean = actionMessage.showPanel;
    publicFolderPickerStore.showPanel = showPanel;
    if (!showPanel) {
        publicFolderPickerStore.selectedFolderId = null;
        publicFolderPickerHeaderStore.isResponseError = false;
        publicFolderPickerHeaderStore.responseMessage = null;
    }
});

mutator(selectPublicFolderNode, actionMessage => {
    const folderId: string = actionMessage.folderId;
    if (publicFolderPickerStore.selectedFolderId == folderId) {
        publicFolderPickerStore.selectedFolderId = null;
    } else {
        publicFolderPickerStore.selectedFolderId = folderId;
    }
});

mutator(updateResponseMessageInPicker, actionMessage => {
    const responseMessageInPicker: string = actionMessage.responseMessageInPicker;
    const isResponseError: boolean = actionMessage.isResponseError;

    publicFolderPickerHeaderStore.responseMessage = responseMessageInPicker;
    publicFolderPickerHeaderStore.isResponseError = isResponseError;
});

mutator(shouldShowPublicFolderErrorDialog, actionMessage => {
    const shouldShow: boolean = actionMessage.shouldShow;
    publicFolderPickerStore.showErrorDialog = shouldShow;
});
