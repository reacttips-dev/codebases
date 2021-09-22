import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "AttachmentPreviewSxS" */ './lazyIndex')
);

// Lazy actions
export const lazyPreviewAttachment = new LazyAction(lazyModule, m => m.previewAttachment);
export const lazyPreviewAttachmentInSxS = new LazyAction(lazyModule, m => m.previewAttachmentInSxS);
export const lazyPreviewBeautifulLinkImageInSxS = new LazyAction(
    lazyModule,
    m => m.previewBeautifulLinkImageInSxS
);
export const lazyPreviewImageInSxS = new LazyAction(lazyModule, m => m.previewImageInSxS);
export const lazyPreviewLinkInSxS = new LazyAction(lazyModule, m => m.previewLinkInSxS);
export const lazyInitializeItemReadingPaneInSxS = new LazyAction(
    lazyModule,
    m => m.initializeItemReadingPaneInSxS
);

export { AttachmentSelectionSource } from 'owa-sxs-store';
export { default as insertSxSV2IntoDomHelper } from './utils/insertSxSV2IntoDomHelper';
export { SxSReadingPaneInitializeMethod } from './types/SxSReadingPaneStrategy';
export type { default as SxSReadingPaneStrategy } from './types/SxSReadingPaneStrategy';
export { loadItemAttachment } from './actions/publicActions';
