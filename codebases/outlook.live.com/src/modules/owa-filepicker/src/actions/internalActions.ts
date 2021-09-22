import type { FilePickerPreloadState } from '../store/schema/FilePickerPreloadState';
import { action } from 'satcheljs';

/* TODO: VSO 30332. Update filepicker to use the new version of satchel
all new internal actions to the filepicker store should be put here
*/
const setPreloadState = action('SET_LOAD_STATE', (preloadState: FilePickerPreloadState) => ({
    preloadState: preloadState,
}));

const showFileProviderInlineView = action('SHOW_FILE_PROVIDER_INLINE_VIEW', (visible: boolean) => ({
    visible: visible,
}));

export { setPreloadState, showFileProviderInlineView };
