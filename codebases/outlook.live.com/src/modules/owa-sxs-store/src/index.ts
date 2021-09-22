import * as SxSEventNames from './utils/eventNames';
import { LazyAction, LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "SxS" */ './lazyIndex'));

export const lazySxSStoreModule = new LazyImport(lazyModule, m => m);

export const lazyCanCloseSxS = new LazyImport(lazyModule, m => m.canCloseSxS);
export const lazyCloseComposeInSxS = new LazyImport(lazyModule, m => m.closeComposeInSxS);
export const lazyCreateImageGalleryFromAttachmentViewStateIds = new LazyImport(
    lazyModule,
    m => m.createImageGalleryFromAttachmentViewStateIds
);
export const lazyEditAndReply = new LazyImport(lazyModule, m => m.editAndReply);
export const lazyEditInDraft = new LazyImport(lazyModule, m => m.editInDraft);
export const lazyForceCloseSxS = new LazyImport(lazyModule, m => m.forceCloseSxS);
export const lazyLogUsageWithSxSCustomData = new LazyAction(
    lazyModule,
    m => m.logUsageWithSxSCustomData
);
export const lazyRemoveSxSViewFromDOM = new LazyAction(lazyModule, m => m.removeSxSViewFromDOM);
export const lazyOnBeforeImageGalleryItemSelected = new LazyImport(
    lazyModule,
    m => m.onBeforeImageGalleryItemSelected
);
export const lazyOnChangeByImageGallery = new LazyImport(lazyModule, m => m.onChangeByImageGallery);
export const lazyOnPendingNavigation = new LazyImport(lazyModule, m => m.onPendingNavigation);
export const lazyOnPreviewOperationFinished = new LazyImport(
    lazyModule,
    m => m.onPreviewOperationFinished
);
export const lazyOnPreviewOperationStart = new LazyImport(
    lazyModule,
    m => m.onPreviewOperationStart
);
export const lazyOpenComposeInSxS = new LazyImport(lazyModule, m => m.openComposeInSxS);
export const lazyReloadTextPreview = new LazyImport(lazyModule, m => m.reloadTextPreview);
export const lazyShowSxS = new LazyImport(lazyModule, m => m.showSxS);
export const lazyTryCloseSxS = new LazyAction(lazyModule, m => m.tryCloseSxS);
export const lazyTryExitSxSEditMode = new LazyImport(lazyModule, m => m.tryExitSxSEditMode);
export const lazySaveToCloudFromSxS = new LazyImport(lazyModule, m => m.saveToCloudFromSxS);

export {
    cloneSxSStore,
    onSxSChangeOrClose,
    showSxS,
    closeSxS,
    onSxSReadingPaneChange,
    onBeforeSxSReadingPaneChange,
    onComposeStateChange,
    onCustomizationChange,
} from './actions/publicActions';

export { default as getOrCreateSxSStoreData } from './store/Store';
export { SxSEventNames };
export { default as getActiveSxSId } from './utils/getActiveSxSId';
export {
    default as isSxSDisplayed,
    isSxSDisplayedForAttachment,
    isSxSDisplayedWithCompose,
} from './utils/isSxSDisplayed';
export { default as isAnySxSDisplayedInMainWindow } from './utils/isAnySxSDisplayed';
export { default as findSxSIdByFullComposeId } from './utils/findSxSIdByFullComposeId';
export { SxSCustomization, SXSID_MAIN_WINDOW, SXSV2_CONTAINER_ID } from './store/schema/SxSStore';
export type { SxSStoreData } from './store/schema/SxSStore';
export { SxSReadingPaneMode } from './store/schema/SxSReadingPaneState';
export type {
    SxSConversationReadingPaneState,
    SxSItemReadingPaneState,
} from './store/schema/SxSReadingPaneState';
export type { default as SxSExtendedViewState } from './store/schema/SxSExtendedViewState';
export { EditMode } from './store/schema/SxSEditState';
export { default as AttachmentPreviewMode } from './store/schema/AttachmentPreviewMode';

export { AttachmentSelectionSource } from 'owa-attachment-data';
