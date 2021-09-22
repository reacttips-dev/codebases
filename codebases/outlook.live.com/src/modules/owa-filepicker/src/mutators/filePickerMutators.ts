import { setPreloadState, showFileProviderInlineView } from '../actions/internalActions';
import { getFilePickerStore } from '../store/filePickerStore';
import { mutator } from 'satcheljs';

/* TODO: VSO 30332. Update filepicker to use the new version of satchel
all new mutators to the filepicker store should be put here
*/
mutator(setPreloadState, action => {
    getFilePickerStore().viewState.preloadState = action.preloadState;
});

mutator(showFileProviderInlineView, action => {
    const viewState = getFilePickerStore().viewState;
    viewState.showFileProviderInlineView = action.visible;
});
