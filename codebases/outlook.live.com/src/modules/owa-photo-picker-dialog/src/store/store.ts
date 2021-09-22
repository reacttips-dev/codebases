import type { PhotoPickerDialogState } from './schema/Schema';
import { createStore } from 'satcheljs';

// Photo picker dialog store
const photoPickerDialogState: PhotoPickerDialogState = {
    showDialog: true,
};

export const getStore = createStore<PhotoPickerDialogState>(
    'photoPickerDialogStore',
    photoPickerDialogState
);
