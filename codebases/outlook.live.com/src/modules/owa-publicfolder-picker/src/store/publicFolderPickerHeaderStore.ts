import { createStore } from 'satcheljs';

export interface PublicFolderPickerHeaderState {
    isResponseError: boolean; // This decides the styling of responseMessage.
    responseMessage: string; // response message, when add to Favorite button is clicked.
}

export default createStore<PublicFolderPickerHeaderState>('publicFolderPickerHeaderState', {
    isResponseError: false,
    responseMessage: null,
})();
