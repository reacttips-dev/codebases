import type {
    AttachmentLocalComputerFilePickerProps,
    IAttachmentLocalComputerFilePicker,
} from './components/AttachmentLocalComputerFilePicker';
export type { IAttachmentLocalComputerFilePicker } from './components/AttachmentLocalComputerFilePicker';
import {
    createLazyComponent,
    LazyAction,
    LazyImport,
    LazyModule,
    LazyModuleType,
} from 'owa-bundling';

export type {
    CreateAttachmentHandler,
    CreateAttachmentHandlerParams,
} from './types/CreateAttachmentHandler';
export type { InsertLinkHandler } from './types/InsertLinkHandler';
export {
    FileSelectionFilter,
    FilePickerAction,
    SelectedFilesSource,
    lazyPreloadFilePicker as lazyInitializeAttachmentFilePicker,
    SizeLimitInKbToSuggestSharing,
    ComposeUniqueState,
    FileProvidersFilter,
    getSupportedFileProvidersFilter,
} from 'owa-filepicker';

/* This package is supposed to encapsulate all the attachment logic around owa-filepicker */
const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "AttachmentFilePicker"*/ './lazyIndex')
);

// Delay loaded actions
export const lazyAttachmentFilePicker = new LazyAction(lazyModule, m => m.attachmentFilePicker);

// Delay loaded imports

// the following can be used to show the actions panel independent of the filepicker
export const lazyAttachmentActionsPanel = new LazyAction(lazyModule, m => m.attachmentActionsPanel);

// Delay loaded components
export const AttachmentLocalComputerFilePicker = createLazyComponent<
    AttachmentLocalComputerFilePickerProps,
    LazyModuleType<typeof lazyModule>,
    IAttachmentLocalComputerFilePicker
>(lazyModule, m => m.AttachmentLocalComputerFilePicker);

// delay loaded utility functions
export const lazyLogAttachOrShareDatapoint = new LazyImport(
    lazyModule,
    m => m.logAttachOrShareDatapoint
);
