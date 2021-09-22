import { action } from 'satcheljs';

export let updateResponseMessageInPicker = action(
    'updateResponseMessageInPicker',
    (responseMessageInPicker: string, isResponseError: boolean) => {
        return {
            responseMessageInPicker,
            isResponseError,
        };
    }
);

export let selectPublicFolderNode = action('selectPublicFolderNode', (folderId: string) => {
    return {
        folderId,
    };
});

export let publicFolderPickerController = action(
    'publicFolderPickerController',
    (showPanel: boolean) => {
        return {
            showPanel,
        };
    }
);

export let shouldShowPublicFolderErrorDialog = action(
    'shouldShowPublicFolderErrorDialog',
    (shouldShow: boolean) => {
        return {
            shouldShow,
        };
    }
);
