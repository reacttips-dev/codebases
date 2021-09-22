import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "SxS" */ './lazyIndex'));

export const lazySxSDataModule = new LazyImport(lazyModule, m => m);
export const lazyResetPreviewPane = new LazyImport(lazyModule, m => m.resetPreviewPane);
export const lazySetAudioPreviewState = new LazyImport(lazyModule, m => m.setAudioPreviewState);
export const lazySetBlankPreviewState = new LazyImport(lazyModule, m => m.setBlankPreviewState);
export const lazySetCustomPreviewState = new LazyImport(lazyModule, m => m.setCustomPreviewState);
export const lazySetIframePreviewState = new LazyImport(lazyModule, m => m.setIframePreviewState);
export const lazySetImageGalleryItems = new LazyImport(lazyModule, m => m.setImageGalleryItems);
export const lazySetImagePreviewLoaded = new LazyImport(lazyModule, m => m.setImagePreviewLoaded);
export const lazySetImagePreviewState = new LazyImport(lazyModule, m => m.setImagePreviewState);
export const lazySetImagePreviewStateFromImageGalleryItem = new LazyImport(
    lazyModule,
    m => m.setImagePreviewStateFromImageGalleryItem
);
export const lazySetNativePdfPreviewState = new LazyImport(
    lazyModule,
    m => m.setNativePdfPreviewState
);
export const lazySetPanesSize = new LazyImport(lazyModule, m => m.setPanesSize);
export const lazySetPdfJsPreviewState = new LazyImport(lazyModule, m => m.setPdfJsPreviewState);
export const lazySetPdfJsPreviewStateByData = new LazyImport(
    lazyModule,
    m => m.setPdfJsPreviewStateByData
);
export const lazySetPreviewError = new LazyImport(lazyModule, m => m.setPreviewError);
export const lazySetPreviewLoading = new LazyImport(lazyModule, m => m.setPreviewLoading);
export const lazySetRightPaneDisplayAndUpdateSize = new LazyImport(
    lazyModule,
    m => m.setRightPaneDisplayAndUpdateSize
);
export const lazySetSaveStatusText = new LazyImport(lazyModule, m => m.setSaveStatusText);
export const lazySetTextPreviewState = new LazyImport(lazyModule, m => m.setTextPreviewState);
export const lazySetVideoPreviewState = new LazyImport(lazyModule, m => m.setVideoPreviewState);
export const lazySetWacPreviewState = new LazyImport(lazyModule, m => m.setWacPreviewState);
export const lazySetWacReadOnly = new LazyImport(lazyModule, m => m.setWacReadOnly);
export const lazyUpdatePanesSize = new LazyImport(lazyModule, m => m.updatePanesSize);
export const lazySaveHideReadingPaneOption = new LazyImport(
    lazyModule,
    m => m.saveHideReadingPaneOption
);
export const lazySaveDefaultEditCommandOption = new LazyImport(
    lazyModule,
    m => m.saveDefaultEditCommandOption
);

export { AutoHideEmailEvent } from './utils/eventNames';
export { MIN_PREVIEW_PANE_WIDTH, RESPONSIVE_READING_PANE_WIDTH } from './utils/sxsConstants';
export type { default as JsApiInfo } from './store/schema/JsApiInfo';
export type { default as LoadedInfo } from './store/schema/LoadedInfo';
export type { default as WacPreviewState } from './store/schema/WacPreviewState';
export type { default as VideoPreviewState } from './store/schema/VideoPreviewState';
export type { default as TextPreviewState } from './store/schema/TextPreviewState';
export { RightPaneDisplay } from './store/schema/SxSViewState';
export type { default as SxSViewState } from './store/schema/SxSViewState';
export { PreviewPaneMode } from './store/schema/PreviewPaneViewState';
export type {
    PreviewPaneErrorViewState,
    PreviewPaneLoadingViewState,
    PreviewPaneViewStateBase,
} from './store/schema/PreviewPaneViewState';
export { PdfJsPasswordState } from './store/schema/PdfJsPreviewState';
export type { default as PdfJsPreviewState } from './store/schema/PdfJsPreviewState';
export type { default as NativePdfPreviewState } from './store/schema/NativePdfPreviewState';
export type { default as ImagePreviewState } from './store/schema/ImagePreviewState';
export type { default as ImageGalleryItem } from './store/schema/ImageGalleryItem';
export type { default as IframePreviewState } from './store/schema/IFramePreviewState';
export type { default as AudioPreviewState } from './store/schema/AudioPreviewState';
