import { LazyModule, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "InfoBarView" */ './lazyIndex')
);

export const lazyProcessInlineImageBeforeUpload = new LazyImport(
    lazyModule,
    m => m.processInlineImageBeforeUpload
);
export const lazySetOriginalSrcForSmime = new LazyImport(lazyModule, m => m.setOriginalSrcForSmime);
export const lazyGetExpirableImageBase64Src = new LazyImport(
    lazyModule,
    m => m.getExpirableImageBase64Src
);
export const lazyOnImageError = new LazyImport(lazyModule, m => m.onImageError);
export { default as convertAllContentIdToAttachmentUrl } from './utils/convertAllContentIdToAttachmentUrl';
