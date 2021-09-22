import { LazyModule, LazyAction } from 'owa-bundling-light';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "AttachmentsHx" */ './lazyIndex')
);

export const lazyIsHxAttachment = new LazyAction(lazyModule, m => m.isHxAttachment);
export const lazyDownloadAttachmentFromHx = new LazyAction(
    lazyModule,
    m => m.downloadAttachmentFromHx
);
export const lazyGetHxAttachmentUri = new LazyAction(lazyModule, m => m.getHxAttachmentUri);
