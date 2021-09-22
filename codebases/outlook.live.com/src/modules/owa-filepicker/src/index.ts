import { createLazyComponent, LazyImport, LazyModule, LazyModuleType } from 'owa-bundling';
import type {
    LocalComputerFilePickerProps,
    ILocalComputerFilePicker,
} from './components/LocalComputerFilePicker';
import './mutators/filePickerMutators';

export type { ILocalComputerFilePicker } from './components/LocalComputerFilePicker';
export { default as FilePickerAction } from './store/schema/FilePickerAction';
export type { default as FilePickerConfiguration } from './store/schema/FilePickerConfiguration';
export { SelectedFilesSource } from './types/FilePickerResult';
export type { default as FilePickerResult } from './types/FilePickerResult';
export { ComposeUniqueState } from './store/schema/FilePickerUploadConfiguration';
export type { default as FilePickerUploadConfiguration } from './store/schema/FilePickerUploadConfiguration';
export { FilePickerViewType } from './types/FilePickerViewSwitcher';
export { FileSelectionFilter } from 'owa-fileprovider-store';
export type { default as FilePickerUserConfiguration } from './store/schema/FilePickerUserConfiguration';
export { FileProviderItemType } from './store/schema/FileProviderItemViewState';
export type { default as FileProviderItemViewState } from './store/schema/FileProviderItemViewState';
export { SizeLimitInKbToSuggestSharing } from './utils/filePickerConstants';
export { default as getSupportedFileProvidersFilter } from './utils/getSupportedFileProvidersFilter';
export { FileProvidersFilter } from './store/schema/FileProvidersFilter';

/* This package SHOULD contain minimal attachment related logic. It should NOT take any dependencies on the attachment package.
   It is supposed to be self contained and possibly reusable outside OWA for picking files from different providers */
const lazyModule = new LazyModule(() => import(/* webpackChunkName: "FilePicker"*/ './lazyIndex'));

// Delay loaded components
export const LocalComputerFilePicker = createLazyComponent<
    LocalComputerFilePickerProps,
    LazyModuleType<typeof lazyModule>,
    ILocalComputerFilePicker
>(lazyModule, m => m.LocalComputerFilePicker);

export const FilePickerActionsPanelButtonView = createLazyComponent(
    lazyModule,
    m => m.FilePickerActionsPanelButtonView
);

// Delay loaded imports
export const lazyFilePicker = new LazyImport(lazyModule, m => m.filePicker);
export const lazyActionsPanel = new LazyImport(lazyModule, m => m.actionsPanel);
export const lazyGetFileProviderItems = new LazyImport(lazyModule, m => m.getFileProviderItems);

export const lazyCreateFileProviderItemsViewState = new LazyImport(
    lazyModule,
    m => m.createFileProviderItemsViewState
);

export const lazyPreloadFilePicker = new LazyImport(lazyModule, m => m.preloadFilePicker);
export const lazyGetUserPreferredFilePickerAction = new LazyImport(
    lazyModule,
    m => m.getUserPreferredFilePickerAction
);

export const lazyGetDefaultFileProvider = new LazyImport(lazyModule, m => m.getDefaultFileProvider);
export const lazyGetShareIconForActionPanel = new LazyImport(
    lazyModule,
    m => m.getShareIconForActionPanel
);
